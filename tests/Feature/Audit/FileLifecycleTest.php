<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileLifecycleTest extends TestCase
{
    use DatabaseTransactions;

    private function fakePng(string $name = 'avatar.png'): UploadedFile
    {
        $pngBytes = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        );

        return UploadedFile::fake()->createWithContent($name, $pngBytes);
    }

    public function test_sign_up_with_invalid_osra_code_leaves_zero_orphaned_user_photos(): void
    {
        Storage::fake('public');

        $mobile = '012' . str_pad((string) random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);

        $this->postJson(route('sign_up.store'), [
            'full_name' => 'Orphan Test',
            'email' => 'orphan.' . uniqid() . '@example.test',
            'mobile' => $mobile,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'osra_code' => 'NON_EXISTENT_OSRA_999',
            'user_photo' => $this->fakePng('orphan.png'),
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('osra_code');

        $this->assertSame([], Storage::disk('public')->allFiles('user_photos'));
    }

    public function test_profile_update_stores_in_user_photos_and_replaces_old_photo_and_category_delete_cleans_storage(): void
    {
        Storage::fake('public');

        Storage::disk('public')->put('user_photos/old-avatar.png', 'old');
        $user = User::factory()->create([
            'user_photo' => 'user_photos/old-avatar.png',
        ]);

        // Invalid osra_code must not delete old photo or store new photo
        $this->actingAs($user)
            ->postJson(route('profile.update'), [
                'full_name' => $user->full_name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'osra_code' => 'INVALID_CODE_XYZ',
                'user_photo' => $this->fakePng('rejected.png'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('osra_code');

        Storage::disk('public')->assertExists('user_photos/old-avatar.png');

        // Valid update stores under user_photos and removes old-avatar.png
        $this->actingAs($user)
            ->post(route('profile.update'), [
                'full_name' => 'Updated Photo User',
                'email' => $user->email,
                'mobile' => $user->mobile,
                'user_photo' => $this->fakePng('new-avatar.png'),
            ])
            ->assertRedirect();

        $freshUser = $user->fresh();
        $this->assertStringStartsWith('user_photos/', (string) $freshUser->user_photo);
        Storage::disk('public')->assertExists($freshUser->user_photo);
        Storage::disk('public')->assertMissing('user_photos/old-avatar.png');

        // Category deletion deletes photo after DB commit
        $manager = User::factory()->manager()->create();
        $main = Main_Category::create([
            'category_name' => 'File Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/main.png',
            'can_go_outside' => 1,
        ]);
        Storage::disk('public')->put('categories/sub-to-delete.png', 'sub');
        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'File Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/sub-to-delete.png',
        ]);

        $this->actingAs($manager)
            ->delete(route('categories.destroy', $sub->category_id))
            ->assertRedirect();

        $this->assertNull(Category::find($sub->category_id));
        Storage::disk('public')->assertMissing('categories/sub-to-delete.png');
    }
}
