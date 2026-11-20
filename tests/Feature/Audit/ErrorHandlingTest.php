<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ErrorHandlingTest extends TestCase
{
    use DatabaseTransactions;

    public function test_guests_visiting_auth_protected_routes_redirect_to_login_instead_of_500(): void
    {
        $this->get('/users')->assertRedirect('/login');
        $this->get('/osras')->assertRedirect('/login');
        $this->get('/register')->assertRedirect('/login');
    }

    public function test_guests_requesting_json_from_auth_routes_receive_401(): void
    {
        $this->getJson('/users')->assertStatus(401);
        $this->getJson('/osras')->assertStatus(401);
    }

    public function test_managers_can_access_users_and_osras(): void
    {
        $manager = User::factory()->manager()->create();

        $this->actingAs($manager)->get('/users')->assertOk();
        $this->actingAs($manager)->get('/osras')->assertOk();
    }

    public function test_regular_users_cannot_access_manager_routes_without_500(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/users');
        $this->assertNotEquals(500, $response->getStatusCode());
    }
}
