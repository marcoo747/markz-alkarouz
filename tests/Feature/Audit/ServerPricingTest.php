<?php

namespace Tests\Feature\Audit;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ServerPricingTest extends TestCase
{
    use DatabaseTransactions;

    private function createProduct(float $price, string $name = 'Priced Gear'): Product
    {
        $main = Main_Category::create([
            'category_name' => 'Pricing Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'Pricing Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);

        return Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => $name,
            'brand' => 'BrandX',
            'pr_description' => 'Gear description',
            'pr_price' => $price,
            'inventory_quantity' => 10,
        ]);
    }

    public function test_empty_or_missing_cart_is_rejected(): void
    {
        $user = User::factory()->create();
        $beforeCount = UserRequest::where('user_id', $user->user_id)->count();

        $this->actingAs($user)
            ->post(route('requests.createFromCart'), [
                'start_date' => '2026-12-01',
                'end_date' => '2026-12-02',
                'total_price' => 50,
            ])
            ->assertSessionHasErrors('cart');

        $this->assertSame($beforeCount, UserRequest::where('user_id', $user->user_id)->count());

        Cart::create(['user_id' => $user->user_id]);

        $this->actingAs($user)
            ->postJson(route('requests.createFromCart'), [
                'start_date' => '2026-12-01',
                'end_date' => '2026-12-02',
                'total_price' => 50,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('cart');

        $this->assertSame($beforeCount, UserRequest::where('user_id', $user->user_id)->count());
    }

    public function test_create_from_cart_ignores_client_total_price_and_computes_server_total(): void
    {
        $user = User::factory()->create();
        $productA = $this->createProduct(12.50, 'Item A');
        $productB = $this->createProduct(40.00, 'Item B');

        $cart = Cart::create(['user_id' => $user->user_id]);
        $cart->products()->attach($productA->product_id, [
            'quantity' => 3,
        ]);
        $cart->products()->attach($productB->product_id, [
            'quantity' => 2,
        ]);

        // Even with a tampered negative or penny total_price, server computes (12.50 * 3) + (40.00 * 2) = 117.50
        $this->actingAs($user)
            ->post(route('requests.createFromCart'), [
                'start_date' => '2026-12-05',
                'end_date' => '2026-12-06',
                'start_time' => '10:00',
                'end_time' => '14:00',
                'total_price' => -999,
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $created = UserRequest::with('products')
            ->where('user_id', $user->user_id)
            ->latest('request_id')
            ->firstOrFail();

        $this->assertEquals(117.50, (float) $created->total_price);
        $this->assertSame('pending', $created->request_status);
        $this->assertCount(2, $created->products);
        $this->assertSame(0, $cart->fresh('products')->products->count());
    }
}
