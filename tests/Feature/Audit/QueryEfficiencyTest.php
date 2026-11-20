<?php

namespace Tests\Feature\Audit;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QueryEfficiencyTest extends TestCase
{
    use DatabaseTransactions;

    public function test_home_request_does_not_execute_update_requests_query(): void
    {
        DB::flushQueryLog();
        DB::enableQueryLog();

        try {
            $this->get(route('home'))->assertOk();
            $queries = array_map(fn ($q) => strtolower($q['query']), DB::getQueryLog());
        } finally {
            DB::disableQueryLog();
        }

        foreach ($queries as $sql) {
            $this->assertFalse(
                str_contains($sql, 'update `requests`') || str_contains($sql, 'update requests'),
                "Unexpected UPDATE requests query during web request: {$sql}"
            );
        }
    }

    public function test_delayed_requests_command_is_scheduled(): void
    {
        $events = app(Schedule::class)->events();
        $commands = array_map(fn ($event) => $event->command ?? '', $events);

        $this->assertTrue(
            collect($commands)->contains(fn ($cmd) => str_contains($cmd, 'requests:process-delayed')),
            'Expected requests:process-delayed to be registered in the Laravel scheduler.'
        );
    }

    public function test_cart_products_pluck_does_not_eager_load_images_while_cart_index_does(): void
    {
        $user = User::factory()->create();

        $main = Main_Category::create([
            'category_name' => 'Eff Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'Eff Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);

        $product = Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => 'Eff Item',
            'brand' => 'BrandE',
            'pr_description' => 'Desc',
            'pr_price' => 15,
            'inventory_quantity' => 4,
        ]);

        $cart = Cart::create(['user_id' => $user->user_id]);
        $cart->products()->attach($product->product_id, ['quantity' => 1]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        try {
            $ids = $cart->products()->pluck('products.product_id')->toArray();
            $queries = array_map(fn ($q) => strtolower($q['query']), DB::getQueryLog());
        } finally {
            DB::disableQueryLog();
        }

        $this->assertSame([$product->product_id], $ids);
        foreach ($queries as $sql) {
            $this->assertStringNotContainsString('pr_photos', $sql);
        }

        $this->actingAs($user)
            ->get(route('cart'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('CartPage')
                ->has('cart.products', 1)
                ->has('cart.products.0.images')
            );
    }
}
