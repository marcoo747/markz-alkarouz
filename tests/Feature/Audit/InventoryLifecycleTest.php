<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Missings;
use App\Models\Product;
use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InventoryLifecycleTest extends TestCase
{
    use DatabaseTransactions;

    private function createProduct(int $inventory = 10, string $name = 'Lifecycle Gear'): Product
    {
        $main = Main_Category::create([
            'category_name' => 'Lifecycle Main ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'main_categories/test.png',
            'can_go_outside' => 1,
        ]);

        $sub = Category::create([
            'main_category_id' => $main->category_id,
            'category_name' => 'Lifecycle Sub ' . uniqid(),
            'category_description' => 'Desc',
            'category_photo' => 'categories/test.png',
        ]);

        return Product::create([
            'main_category_id' => $main->category_id,
            'category_id' => $sub->category_id,
            'pr_name' => $name,
            'brand' => 'BrandL',
            'pr_description' => 'Desc',
            'pr_price' => 25,
            'inventory_quantity' => $inventory,
        ]);
    }

    private function createRequestWithProduct(User $user, Product $product, int $qty, string $status = 'pending', ?\DateTimeInterface $expiry = null): array
    {
        $req = UserRequest::create([
            'user_id' => $user->user_id,
            'request_status' => $status,
            'total_price' => $product->pr_price * $qty,
            'expiry_time' => $expiry,
        ]);

        $req->products()->attach($product->product_id, [
            'quantity' => $qty,
            'checked_qnty' => 0,
            'unchecked_qnty' => $qty,
        ]);

        $pivotId = DB::table('request_products')
            ->where('request_id', $req->request_id)
            ->where('product_id', $product->product_id)
            ->value('request_product_id');

        return [$req, $pivotId];
    }

    public function test_accept_is_idempotent_and_prevents_negative_stock(): void
    {
        $manager = User::factory()->manager()->create();
        $user = User::factory()->create();
        $product = $this->createProduct(5);
        [$req] = $this->createRequestWithProduct($user, $product, 3, 'pending');

        $this->actingAs($manager)
            ->post(route('requests.accept', $req->request_id))
            ->assertRedirect();

        $this->assertSame('accepted', $req->fresh()->request_status);
        $this->assertSame(2, (int) $product->fresh()->inventory_quantity);

        // Repeat accept must be idempotent (stock stays 2)
        $this->actingAs($manager)
            ->post(route('requests.accept', $req->request_id))
            ->assertRedirect();

        $this->assertSame(2, (int) $product->fresh()->inventory_quantity);

        // Another request needing 3 when only 2 remain must be rejected by validation without going negative
        [$overReq] = $this->createRequestWithProduct($user, $product, 3, 'pending');
        $this->actingAs($manager)
            ->postJson(route('requests.accept', $overReq->request_id))
            ->assertStatus(422)
            ->assertJsonValidationErrors('inventory');

        $this->assertSame('pending', $overReq->fresh()->request_status);
        $this->assertSame(2, (int) $product->fresh()->inventory_quantity);
    }

    public function test_process_delayed_command_deducts_inventory_atomically(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(8);
        [$expired] = $this->createRequestWithProduct($user, $product, 3, 'pending', now()->subMinutes(5));
        [$future] = $this->createRequestWithProduct($user, $product, 2, 'pending', now()->addMinutes(5));

        $this->artisan('requests:process-delayed')->assertExitCode(0);

        $this->assertSame('accepted', $expired->fresh()->request_status);
        $this->assertSame('pending', $future->fresh()->request_status);
        $this->assertSame(5, (int) $product->fresh()->inventory_quantity);
    }

    public function test_done_validates_status_and_bounds_and_is_idempotent(): void
    {
        $manager = User::factory()->manager()->create();
        $user = User::factory()->create();
        $product = $this->createProduct(10);

        // Pending request cannot jump straight to done
        [$pendingReq, $pendingPivotId] = $this->createRequestWithProduct($user, $product, 4, 'pending');
        $this->actingAs($manager)
            ->postJson(route('requests.done', $pendingReq->request_id), [
                'products' => [[
                    'request_product_id' => $pendingPivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => 4,
                    'shortfall_reason' => 'missing',
                ]],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('request_status');

        // Accept first -> stock becomes 6
        $this->actingAs($manager)->post(route('requests.accept', $pendingReq->request_id));
        $this->assertSame(6, (int) $product->fresh()->inventory_quantity);

        // Bounds check: negative checked_qnty or checked_qnty > quantity fails
        $this->actingAs($manager)
            ->postJson(route('requests.done', $pendingReq->request_id), [
                'products' => [[
                    'request_product_id' => $pendingPivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => -1,
                    'shortfall_reason' => 'missing',
                ]],
            ])
            ->assertStatus(422);

        $this->actingAs($manager)
            ->postJson(route('requests.done', $pendingReq->request_id), [
                'products' => [[
                    'request_product_id' => $pendingPivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => 5,
                    'shortfall_reason' => 'missing',
                ]],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('products');

        $this->assertSame('accepted', $pendingReq->fresh()->request_status);
        $this->assertSame(6, (int) $product->fresh()->inventory_quantity);

        // Valid done: 3 returned, 1 missing -> stock becomes 6 + 3 = 9, 1 Missings row qty=1
        $this->actingAs($manager)
            ->post(route('requests.done', $pendingReq->request_id), [
                'products' => [[
                    'request_product_id' => $pendingPivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => 3,
                    'shortfall_reason' => 'missing',
                    'comment' => 'Left in hall',
                ]],
            ])
            ->assertRedirect(route('requests'));

        $this->assertSame('done', $pendingReq->fresh()->request_status);
        $this->assertSame(9, (int) $product->fresh()->inventory_quantity);
        $this->assertSame(1, Missings::where('request_id', $pendingReq->request_id)->count());

        // Second submit on already-done request must NOT double-increment or duplicate Missings
        $this->actingAs($manager)
            ->post(route('requests.done', $pendingReq->request_id), [
                'products' => [[
                    'request_product_id' => $pendingPivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => 3,
                    'shortfall_reason' => 'missing',
                ]],
            ])
            ->assertRedirect(route('requests'));

        $this->assertSame(9, (int) $product->fresh()->inventory_quantity);
        $this->assertSame(1, Missings::where('request_id', $pendingReq->request_id)->count());
    }

    public function test_reject_restores_accepted_inventory_and_return_missing_validates_upper_bound(): void
    {
        $manager = User::factory()->manager()->create();
        $user = User::factory()->create();
        $product = $this->createProduct(10);

        // Rejecting accepted request restores inventory once
        [$req] = $this->createRequestWithProduct($user, $product, 4, 'pending');
        $this->actingAs($manager)->post(route('requests.accept', $req->request_id));
        $this->assertSame(6, (int) $product->fresh()->inventory_quantity);

        $this->actingAs($manager)->post(route('requests.reject', $req->request_id))->assertRedirect();
        $this->assertSame('rejected', $req->fresh()->request_status);
        $this->assertSame(10, (int) $product->fresh()->inventory_quantity);

        // Repeat reject does not increment again
        $this->actingAs($manager)->post(route('requests.reject', $req->request_id))->assertRedirect();
        $this->assertSame(10, (int) $product->fresh()->inventory_quantity);

        // Missing return workflow
        [$req2, $pivotId2] = $this->createRequestWithProduct($user, $product, 5, 'pending');
        $this->actingAs($manager)->post(route('requests.accept', $req2->request_id));
        $this->actingAs($manager)->post(route('requests.done', $req2->request_id), [
            'products' => [[
                'request_product_id' => $pivotId2,
                'product_id' => $product->product_id,
                'checked_qnty' => 2,
                'shortfall_reason' => 'missing',
            ]],
        ]);
        // Stock: 10 - 5 + 2 = 7, Missing: 3
        $missing = Missings::where('request_id', $req2->request_id)->firstOrFail();

        // Over-return gets 422 validation error, not 500
        $this->actingAs($manager)
            ->postJson(route('missings.return', $missing->missings_id), [
                'quantity_to_return' => 5,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('quantity_to_return');

        // Return 2 -> Missing becomes 1, stock becomes 9, pivot checked=4 unchecked=1
        $this->actingAs($manager)
            ->post(route('missings.return', $missing->missings_id), [
                'quantity_to_return' => 2,
            ])
            ->assertRedirect();

        $this->assertSame(1, (int) $missing->fresh()->quantity);
        $this->assertSame(9, (int) $product->fresh()->inventory_quantity);
        $pivotAfter = DB::table('request_products')->where('request_product_id', $pivotId2)->first();
        $this->assertSame(4, (int) $pivotAfter->checked_qnty);
        $this->assertSame(1, (int) $pivotAfter->unchecked_qnty);
    }

    public function test_damaged_shortfall_persists_on_request_product_and_reloads_on_done_form(): void
    {
        $manager = User::factory()->manager()->create();
        $user = User::factory()->create();
        $product = $this->createProduct(10, 'Fragile Lens');

        [$req, $pivotId] = $this->createRequestWithProduct($user, $product, 4, 'pending');
        $this->actingAs($manager)->post(route('requests.accept', $req->request_id));

        $this->actingAs($manager)
            ->post(route('requests.done', $req->request_id), [
                'products' => [[
                    'request_product_id' => $pivotId,
                    'product_id' => $product->product_id,
                    'checked_qnty' => 3,
                    'shortfall_reason' => 'damaged',
                    'comment' => 'Cracked outer ring',
                ]],
            ])
            ->assertRedirect(route('requests'));

        // Stock: 10 - 4 + 3 = 9; Missings must NOT be created for damaged items
        $this->assertSame(9, (int) $product->fresh()->inventory_quantity);
        $this->assertSame(0, Missings::where('request_id', $req->request_id)->count());

        $pivot = DB::table('request_products')->where('request_product_id', $pivotId)->first();
        $this->assertSame('damaged', $pivot->shortfall_reason);
        $this->assertSame(1, (int) $pivot->unchecked_qnty);

        $this->actingAs($manager)
            ->get(route('doneRequest', $req->request_id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('DoneRequest')
                ->where('requestDetails.products.0.pivot.shortfall_reason', 'damaged')
            );
    }
}
