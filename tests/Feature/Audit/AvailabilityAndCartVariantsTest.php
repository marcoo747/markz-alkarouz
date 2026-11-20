<?php

namespace Tests\Feature\Audit;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Color;
use App\Models\Main_Category;
use App\Models\Material;
use App\Models\Product;
use App\Models\Size;
use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AvailabilityAndCartVariantsTest extends TestCase
{
    use DatabaseTransactions;

    private function seedProductWithVariants(int $inventory = 5, float $price = 30.0): array
    {
        $main = Main_Category::create([
            'category_name' => 'Variant Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'Variant Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);

        $product = Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => 'Variant Projector',
            'brand' => 'BrandV',
            'pr_description' => 'Desc',
            'pr_price' => $price,
            'inventory_quantity' => $inventory,
        ]);

        $red = Color::create(['product_id' => $product->product_id, 'color' => 'Red']);
        $blue = Color::create(['product_id' => $product->product_id, 'color' => 'Blue']);
        $small = Size::create(['product_id' => $product->product_id, 'size' => 'S']);
        $large = Size::create(['product_id' => $product->product_id, 'size' => 'L']);
        $material = Material::create(['product_id' => $product->product_id, 'material_name' => 'Metal']);

        return compact('product', 'red', 'blue', 'small', 'large', 'material');
    }

    public function test_product_show_calculates_window_availability_for_hhmm_and_hhmmss_and_returns_variant_objects(): void
    {
        $user = User::factory()->create();
        $seeded = $this->seedProductWithVariants(5);
        $product = $seeded['product'];

        // Pending custom-window booking holding 5 units (10:00:00 - 14:00:00 on 2026-12-10)
        $customReq = UserRequest::create([
            'user_id' => $user->user_id,
            'start_date' => '2026-12-10',
            'start_time' => '10:00:00',
            'end_date' => '2026-12-10',
            'end_time' => '14:00:00',
            'request_status' => 'pending',
            'total_price' => 150,
        ]);
        $customReq->products()->attach($product->product_id, [
            'quantity' => 5,
            'checked_qnty' => 0,
            'unchecked_qnty' => 5,
        ]);

        // Overlapping window with HH:MM returns HTTP 200 with available_quantity = 0 (not 404)
        $this->get(route('items.show', [
            'id' => $product->product_id,
            'start_date' => '2026-12-10',
            'start_time' => '11:00',
            'end_date' => '2026-12-10',
            'end_time' => '12:00',
        ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductPage')
                ->where('product.available_quantity', 0)
                ->where('product.materials.0.material_name', 'Metal')
                ->where('product.colors.0.color', 'Red')
                ->where('product.sizes.0.size', 'S')
            );

        // Non-overlapping window with HH:MM:SS returns full stock 5
        $this->get(route('items.show', [
            'id' => $product->product_id,
            'start_date' => '2026-12-10',
            'start_time' => '15:00:00',
            'end_date' => '2026-12-10',
            'end_time' => '17:00:00',
        ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProductPage')
                ->where('product.available_quantity', 5)
            );
    }

    public function test_cart_preserves_multiple_variants_handles_missing_cart_remove_and_syncs_all_to_request(): void
    {
        $user = User::factory()->create();
        $seeded = $this->seedProductWithVariants(10, 25.0);
        $product = $seeded['product'];

        // Calling removeProduct when user has no cart must not 500
        $this->actingAs($user)
            ->delete(route('cart.remove'), ['product_id' => $product->product_id])
            ->assertRedirect();

        // Add variant 1: Red + Small (qty 2)
        $this->actingAs($user)
            ->post(route('cart.add'), [
                'product_id' => $product->product_id,
                'color_id' => $seeded['red']->color_id,
                'size_id' => $seeded['small']->size_id,
                'quantity' => 2,
            ])
            ->assertRedirect();

        // Add variant 2: Blue + Large (qty 3)
        $this->actingAs($user)
            ->post(route('cart.add'), [
                'product_id' => $product->product_id,
                'color_id' => $seeded['blue']->color_id,
                'size_id' => $seeded['large']->size_id,
                'quantity' => 3,
            ])
            ->assertRedirect();

        // Adding variant 1 again increments quantity to 3 instead of resetting
        $this->actingAs($user)
            ->post(route('cart.add'), [
                'product_id' => $product->product_id,
                'color_id' => $seeded['red']->color_id,
                'size_id' => $seeded['small']->size_id,
                'quantity' => 1,
            ])
            ->assertRedirect();

        $cart = Cart::where('user_id', $user->user_id)->firstOrFail();
        $cartRows = DB::table('cart_products')->where('cart_id', $cart->cart_id)->orderBy('cart_product_id')->get();
        $this->assertCount(2, $cartRows);
        $this->assertSame(3, (int) $cartRows[0]->quantity);
        $this->assertSame(3, (int) $cartRows[1]->quantity);

        // Removing specific variant preserves the other
        $this->actingAs($user)
            ->delete(route('cart.remove'), [
                'product_id' => $product->product_id,
                'cart_product_id' => $cartRows[0]->cart_product_id,
            ])
            ->assertRedirect();

        $this->assertSame(1, DB::table('cart_products')->where('cart_id', $cart->cart_id)->count());

        // Re-add variant 1 (qty 2) so cart has 2 variants (2 + 3 = 5 units * 25.00 = 125.00)
        $this->actingAs($user)
            ->post(route('cart.add'), [
                'product_id' => $product->product_id,
                'color_id' => $seeded['red']->color_id,
                'size_id' => $seeded['small']->size_id,
                'quantity' => 2,
            ])
            ->assertRedirect();

        $this->actingAs($user)
            ->post(route('requests.createFromCart'), [
                'start_date' => '2026-12-20',
                'end_date' => '2026-12-21',
                'start_time' => '09:00',
                'end_time' => '11:00',
            ])
            ->assertRedirect();

        $created = UserRequest::where('user_id', $user->user_id)->latest('request_id')->firstOrFail();
        $this->assertEquals(125.00, (float) $created->total_price);

        $requestPivots = DB::table('request_products')->where('request_id', $created->request_id)->get();
        $this->assertCount(2, $requestPivots);
    }
}
