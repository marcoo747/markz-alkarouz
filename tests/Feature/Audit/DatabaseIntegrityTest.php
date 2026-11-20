<?php

namespace Tests\Feature\Audit;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Color;
use App\Models\Main_Category;
use App\Models\Osra;
use App\Models\Product;
use App\Models\Size;
use App\Models\TermsAndPenalty;
use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseIntegrityTest extends TestCase
{
    use DatabaseTransactions;

    public function test_deleting_osra_is_blocked_without_force_and_sets_users_osra_id_null_without_deleting_users_or_requests(): void
    {
        $manager = User::factory()->manager()->create();

        $osra = Osra::create([
            'osra_name' => 'Audit Integrity Osra',
            'osra_place' => 'Hall 1',
            'osra_time' => 'Friday 6 PM',
            'osra_code' => 'AUD_OSRA_' . uniqid(),
            'example_date' => '2026-12-04',
            'example_time' => '18:00:00',
        ]);

        $member = User::factory()->create([
            'osra_id' => $osra->osra_id,
        ]);

        $req = UserRequest::create([
            'user_id' => $member->user_id,
            'request_status' => 'pending',
            'total_price' => 20,
        ]);

        // Deleting an Osra with assigned users is refused unless force=1
        $this->actingAs($manager)
            ->deleteJson(route('osra.destroy', $osra->osra_id))
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Cannot delete this Osra while users are assigned to it.']);

        $this->assertNotNull(Osra::find($osra->osra_id));

        // Force-deleting sets users.osra_id to NULL instead of cascade-deleting the user or requests
        $this->actingAs($manager)
            ->delete(route('osra.destroy', $osra->osra_id), ['force' => true])
            ->assertRedirect();

        $this->assertNull(Osra::find($osra->osra_id));
        $freshMember = $member->fresh();
        $this->assertNotNull($freshMember);
        $this->assertNull($freshMember->osra_id);
        $this->assertNotNull(UserRequest::find($req->request_id));
    }

    public function test_collations_unique_osra_index_and_set_null_foreign_keys(): void
    {
        // 1. Verify unified utf8mb4_unicode_ci collations on converted tables
        $collations = DB::table('information_schema.TABLES')
            ->whereRaw('TABLE_SCHEMA = DATABASE()')
            ->whereIn('TABLE_NAME', ['carousel_photos', 'main_categories', 'missings'])
            ->pluck('TABLE_COLLATION', 'TABLE_NAME')
            ->toArray();

        $this->assertSame('utf8mb4_unicode_ci', $collations['carousel_photos'] ?? null);
        $this->assertSame('utf8mb4_unicode_ci', $collations['main_categories'] ?? null);
        $this->assertSame('utf8mb4_unicode_ci', $collations['missings'] ?? null);

        // 2. Verify duplicate osra_code_2 index is dropped
        $osraIndexes = collect(DB::select('SHOW INDEX FROM `osra`'))->pluck('Key_name')->unique()->values()->all();
        $this->assertContains('osra_code', $osraIndexes);
        $this->assertNotContains('osra_code_2', $osraIndexes);

        // 3. Verify deleting staff author sets terms_and_penalties.created_by / updated_by to NULL
        $author = User::factory()->manager()->create();
        $term = TermsAndPenalty::create([
            'title' => 'Audit Term ' . uniqid(),
            'content' => 'Handle with care',
            'type' => 'terms',
            'is_active' => true,
            'created_by' => $author->user_id,
            'updated_by' => $author->user_id,
        ]);

        $author->delete();
        $freshTerm = $term->fresh();
        $this->assertNotNull($freshTerm);
        $this->assertNull($freshTerm->created_by);
        $this->assertNull($freshTerm->updated_by);

        // 4. Verify deleting Color / Size sets cart_products and request_products references to NULL
        $user = User::factory()->create();
        $main = Main_Category::create([
            'category_name' => 'FK Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);
        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'FK Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);
        $product = Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => 'FK Item',
            'brand' => 'BrandFK',
            'pr_description' => 'Desc',
            'pr_price' => 10,
            'inventory_quantity' => 5,
        ]);
        $color = Color::create(['product_id' => $product->product_id, 'color' => 'Green']);
        $size = Size::create(['product_id' => $product->product_id, 'size' => 'M']);

        $cart = Cart::create(['user_id' => $user->user_id]);
        $cart->products()->attach($product->product_id, [
            'color_id' => $color->color_id,
            'size_id' => $size->size_id,
            'quantity' => 1,
        ]);

        $req = UserRequest::create([
            'user_id' => $user->user_id,
            'request_status' => 'pending',
            'total_price' => 10,
        ]);
        $req->products()->attach($product->product_id, [
            'color_id' => $color->color_id,
            'size_id' => $size->size_id,
            'quantity' => 1,
        ]);

        $color->delete();
        $size->delete();

        $cartPivot = DB::table('cart_products')->where('cart_id', $cart->cart_id)->first();
        $reqPivot = DB::table('request_products')->where('request_id', $req->request_id)->first();
        $this->assertNull($cartPivot->color_id);
        $this->assertNull($cartPivot->size_id);
        $this->assertNull($reqPivot->color_id);
        $this->assertNull($reqPivot->size_id);
    }
}
