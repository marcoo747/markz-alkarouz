<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CanGoOutsideVisibilityTest extends TestCase
{
    use DatabaseTransactions;

    private function seedCatalogPair(): array
    {
        $publicMain = Main_Category::create([
            'category_name' => 'Audit Public Main',
            'category_description' => 'Outside allowed',
            'category_photo' => 'main_categories/pub.png',
            'can_go_outside' => 1,
        ]);
        $publicSub = Category::create([
            'main_category_id' => $publicMain->category_id,
            'category_name' => 'Audit Public Sub',
            'category_description' => 'Outside sub',
            'category_photo' => 'categories/pub_sub.png',
        ]);
        $publicProduct = Product::create([
            'main_category_id' => $publicMain->category_id,
            'category_id' => $publicSub->category_id,
            'pr_name' => 'AuditPublicAlpha',
            'brand' => 'BrandA',
            'pr_description' => 'Public gear',
            'pr_price' => 10,
            'inventory_quantity' => 5,
        ]);

        $hiddenMain = Main_Category::create([
            'category_name' => 'Audit Hidden Main',
            'category_description' => 'Internal only',
            'category_photo' => 'main_categories/priv.png',
            'can_go_outside' => 0,
        ]);
        $hiddenSub = Category::create([
            'main_category_id' => $hiddenMain->category_id,
            'category_name' => 'Audit Hidden Sub',
            'category_description' => 'Internal sub',
            'category_photo' => 'categories/priv_sub.png',
        ]);
        $hiddenProduct = Product::create([
            'main_category_id' => $hiddenMain->category_id,
            'category_id' => $hiddenSub->category_id,
            'pr_name' => 'AuditHiddenOmega',
            'brand' => 'BrandB',
            'pr_description' => 'Hidden internal gear',
            'pr_price' => 25,
            'inventory_quantity' => 5,
        ]);

        return compact(
            'publicMain',
            'publicSub',
            'publicProduct',
            'hiddenMain',
            'hiddenSub',
            'hiddenProduct'
        );
    }

    public function test_guests_cannot_see_or_directly_access_can_go_outside_zero_resources(): void
    {
        $data = $this->seedCatalogPair();

        // Direct URLs to hidden main category, subcategory, and item MUST return 404
        $this->get("/main_categories/{$data['hiddenMain']->category_id}")->assertStatus(404);
        $this->get("/categories/{$data['hiddenSub']->category_id}")->assertStatus(404);
        $this->get("/items/{$data['hiddenProduct']->product_id}")->assertStatus(404);

        // Public endpoints still work for public items
        $this->get("/main_categories/{$data['publicMain']->category_id}")->assertOk();
        $this->get("/categories/{$data['publicSub']->category_id}")->assertOk();
        $this->get("/items/{$data['publicProduct']->product_id}")->assertOk();

        // /home excludes hidden items
        $this->get('/home?per_page=100')
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($data) {
                $ids = collect($page->toArray()['props']['products'])->pluck('id')->all();
                $this->assertContains($data['publicProduct']->product_id, $ids);
                $this->assertNotContains($data['hiddenProduct']->product_id, $ids);
            });

        // /categories excludes hidden main categories
        $this->get('/categories?per_page=100')
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($data) {
                $ids = collect($page->toArray()['props']['main_categories'])->pluck('category_id')->all();
                $this->assertContains($data['publicMain']->category_id, $ids);
                $this->assertNotContains($data['hiddenMain']->category_id, $ids);
            });

        // /all-categories excludes hidden subcategories
        $this->get('/all-categories?per_page=100')
            ->assertOk()
            ->assertInertia(function (Assert $page) use ($data) {
                $ids = collect($page->toArray()['props']['categories'])->pluck('category_id')->all();
                $this->assertContains($data['publicSub']->category_id, $ids);
                $this->assertNotContains($data['hiddenSub']->category_id, $ids);
            });

        // /search excludes hidden items
        $this->get('/search?query=AuditHiddenOmega')
            ->assertOk()
            ->assertInertia(function (Assert $page) {
                $this->assertCount(0, $page->toArray()['props']['results']);
            });

        // /api/available-products excludes hidden items
        $apiIds = collect($this->getJson('/api/available-products?query=AuditHiddenOmega')->assertOk()->json())
            ->pluck('id')
            ->all();
        $this->assertNotContains($data['hiddenProduct']->product_id, $apiIds);
    }

    public function test_authenticated_users_and_managers_can_view_can_go_outside_zero_resources(): void
    {
        $data = $this->seedCatalogPair();
        $user = User::factory()->create();
        $manager = User::factory()->manager()->create();

        foreach ([$user, $manager] as $actor) {
            $this->actingAs($actor)->get("/main_categories/{$data['hiddenMain']->category_id}")->assertOk();
            $this->actingAs($actor)->get("/categories/{$data['hiddenSub']->category_id}")->assertOk();
            $this->actingAs($actor)->get("/items/{$data['hiddenProduct']->product_id}")->assertOk();

            $this->actingAs($actor)->get('/search?query=AuditHiddenOmega')
                ->assertOk()
                ->assertInertia(function (Assert $page) use ($data) {
                    $ids = collect($page->toArray()['props']['results'])->pluck('product_id')->all();
                    $this->assertContains($data['hiddenProduct']->product_id, $ids);
                });

            $apiIds = collect($this->actingAs($actor)->getJson('/api/available-products?query=AuditHiddenOmega')->assertOk()->json())
                ->pluck('id')
                ->all();
            $this->assertContains($data['hiddenProduct']->product_id, $apiIds);
        }
    }
}
