<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use DatabaseTransactions;

    public function test_manager_can_update_product_fields_and_negative_values_are_rejected(): void
    {
        $manager = User::factory()->manager()->create();

        $main = Main_Category::create([
            'category_name' => 'CRUD Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'CRUD Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);

        $product = Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => 'Old Name',
            'brand' => 'Old Brand',
            'pr_description' => 'Old Desc',
            'pr_price' => 10,
            'inventory_quantity' => 5,
        ]);

        $this->actingAs($manager)
            ->put(route('items.update', $product->product_id), [
                'name' => 'Updated Tripod',
                'brand' => 'Manfrotto',
                'description' => 'Carbon tripod',
                'price' => 45.5,
                'inventory_quantity' => 8,
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $fresh = $product->fresh();
        $this->assertSame('Updated Tripod', $fresh->pr_name);
        $this->assertSame('Manfrotto', $fresh->brand);
        $this->assertSame('Carbon tripod', $fresh->pr_description);
        $this->assertEquals(45.5, (float) $fresh->pr_price);
        $this->assertSame(8, (int) $fresh->inventory_quantity);

        $this->actingAs($manager)
            ->putJson(route('items.update', $product->product_id), [
                'name' => 'Bad Product',
                'brand' => 'BrandX',
                'description' => 'Desc',
                'price' => -5,
                'inventory_quantity' => -1,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['price', 'inventory_quantity']);
    }

    public function test_all_categories_includes_main_categories_prop_and_category_store_validates_main_category_id(): void
    {
        $manager = User::factory()->manager()->create();

        Main_Category::create([
            'category_name' => 'AllCat Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $this->actingAs($manager)
            ->get(route('categories.all'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Categories')
                ->has('main_categories')
            );

        $this->actingAs($manager)
            ->postJson(route('categories.store'), [
                'category_name' => 'Bad Sub',
                'category_description' => 'Desc',
                'main_category_id' => 999999999,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['main_category_id', 'category_photo']);
    }
}
