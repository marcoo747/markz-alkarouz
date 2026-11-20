<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RequestAuthorizationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_users_can_view_only_their_own_requests_while_staff_can_view_all(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $manager = User::factory()->manager()->create();

        $requestA = UserRequest::create([
            'user_id' => $userA->user_id,
            'request_status' => 'pending',
            'total_price' => 0,
        ]);

        $requestB = UserRequest::create([
            'user_id' => $userB->user_id,
            'request_status' => 'pending',
            'total_price' => 0,
        ]);

        $this->get(route('requests.show', $requestB->request_id))
            ->assertRedirect('/login');

        $this->actingAs($userA)
            ->get(route('requests.show', $requestA->request_id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('RequestShow'));

        $this->actingAs($userA)
            ->get(route('requests.show', $requestB->request_id))
            ->assertStatus(403);

        $this->actingAs($admin)
            ->get(route('requests.show', $requestB->request_id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('RequestShow'));

        $this->actingAs($manager)
            ->get(route('requests.show', $requestB->request_id))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('RequestShow'));
    }

    public function test_staff_requests_index_lists_all_users_requests(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $manager = User::factory()->manager()->create();

        $reqA = UserRequest::create([
            'user_id' => $userA->user_id,
            'request_status' => 'pending',
            'total_price' => 0,
        ]);

        $reqB = UserRequest::create([
            'user_id' => $userB->user_id,
            'request_status' => 'accepted',
            'total_price' => 0,
        ]);

        $this->actingAs($userA)->get(route('requests'))->assertStatus(403);

        foreach ([$admin, $manager] as $staff) {
            $this->actingAs($staff)
                ->get(route('requests'))
                ->assertOk()
                ->assertInertia(function (Assert $page) use ($reqA, $reqB) {
                    $ids = collect($page->toArray()['props']['requests'])->pluck('request_id')->all();
                    $this->assertContains($reqA->request_id, $ids);
                    $this->assertContains($reqB->request_id, $ids);
                });
        }
    }
}
