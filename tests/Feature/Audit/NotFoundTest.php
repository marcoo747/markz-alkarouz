<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotFoundTest extends TestCase
{
    use DatabaseTransactions;

    public function test_unknown_urls_render_errors_404_with_404_status_for_all_roles(): void
    {
        $this->get('/nonexistent-audit-test-404')
            ->assertStatus(404)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/404'));

        $user = User::factory()->create();
        $this->actingAs($user)
            ->get('/nonexistent-audit-test-404')
            ->assertStatus(404)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/404'));

        $manager = User::factory()->manager()->create();
        $this->actingAs($manager)
            ->get('/nonexistent-audit-test-404')
            ->assertStatus(404)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/404'));
    }

    public function test_missing_product_renders_errors_404_with_404_status(): void
    {
        $this->get('/items/999999999')
            ->assertStatus(404)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/404'));
    }

    public function test_json_404_requests_receive_json(): void
    {
        $this->getJson('/nonexistent-audit-test-404')
            ->assertStatus(404)
            ->assertJson(['message' => 'Not Found.']);
    }
}
