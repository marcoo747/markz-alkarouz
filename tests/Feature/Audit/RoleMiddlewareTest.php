<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use DatabaseTransactions;

    public function test_guests_are_redirected_to_login_from_role_protected_web_routes(): void
    {
        $this->get('/cart')->assertRedirect('/login');
        $this->get('/requests')->assertRedirect('/login');
        $this->get('/profile')->assertRedirect('/login');
    }

    public function test_guests_receive_401_from_role_protected_json_routes(): void
    {
        $this->getJson('/api/terms-penalties')->assertStatus(401);
        $this->getJson('/api/managers')->assertStatus(401);
    }

    public function test_unauthorized_authenticated_users_receive_http_403_status_with_error_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/requests')
            ->assertStatus(403)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/403'));

        $this->actingAs($user)
            ->get('/users')
            ->assertStatus(403)
            ->assertInertia(fn (Assert $page) => $page->component('Errors/403'));
    }

    public function test_unauthorized_json_requests_receive_403_json(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/terms-penalties', [])
            ->assertStatus(403);
    }

    public function test_authorized_roles_can_access_their_routes(): void
    {
        $manager = User::factory()->manager()->create();

        $this->actingAs($manager)->get('/requests')->assertOk();
        $this->actingAs($manager)->get('/users')->assertOk();
    }
}
