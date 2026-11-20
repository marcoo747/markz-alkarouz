<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RelationAndStorageSafetyTest extends TestCase
{
    use DatabaseTransactions;

    public function test_main_category_relations_return_products_and_sub_categories_by_main_category_id(): void
    {
        $otherMain = Main_Category::create([
            'category_name' => 'Other Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/other.png',
            'can_go_outside' => 1,
        ]);

        $targetMain = Main_Category::create([
            'category_name' => 'Target Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/target.png',
            'can_go_outside' => 1,
        ]);

        $subCategory = Category::create([
            'main_category_id' => $targetMain->category_id,
            'category_name' => 'Child Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/child.png',
        ]);

        // Product whose main_category_id is targetMain (even though category_id differs)
        $product = Product::create([
            'main_category_id' => $targetMain->category_id,
            'category_id' => $subCategory->category_id,
            'pr_name' => 'Main Relation Product',
            'brand' => 'BrandR',
            'pr_description' => 'Desc',
            'pr_price' => 25,
            'inventory_quantity' => 5,
        ]);

        $relatedProducts = $targetMain->products()->pluck('product_id')->all();
        $relatedSubs = $targetMain->sub_category()->pluck('category_id')->all();

        $this->assertContains($product->product_id, $relatedProducts);
        $this->assertContains($subCategory->category_id, $relatedSubs);
        $this->assertSame([], $otherMain->products()->pluck('product_id')->all());
    }

    public function test_missing_user_photo_on_disk_falls_back_gracefully_and_storage_missing_file_never_returns_500(): void
    {
        $manager = User::factory()->manager()->create([
            'user_photo' => 'user_photos/does-not-exist-audit.png',
        ]);

        $this->actingAs($manager)
            ->get(route('profile'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProfilePage')
                ->where('user.profilePhoto', asset('imgs/AlkaroozCom.png'))
            );

        $this->actingAs($manager)
            ->get(route('users.index'))
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($manager) {
                $users = collect($page->toArray()['props']['users']);
                $row = $users->firstWhere('user_id', $manager->user_id);
                $this->assertNotNull($row);
                $this->assertNull($row['user_photo']);
            });

        $managersRes = $this->actingAs($manager)
            ->getJson(route('api.managers'))
            ->assertOk()
            ->json('managers');

        $managerEntry = collect($managersRes)->firstWhere('user_id', $manager->user_id);
        $this->assertNotNull($managerEntry);
        $this->assertNull($managerEntry['user_photo']);

        $response = $this->get('/storage/nonexistent-audit-avatar.png');
        $this->assertNotSame(500, $response->getStatusCode());
    }
}
