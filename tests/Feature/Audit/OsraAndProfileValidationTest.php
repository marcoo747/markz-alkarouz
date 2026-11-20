<?php

namespace Tests\Feature\Audit;

use App\Models\Osra;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class OsraAndProfileValidationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_osra_store_ignores_extra_fields_and_update_enforces_unique_code(): void
    {
        $manager = User::factory()->manager()->create();

        $osra1 = Osra::create([
            'osra_name' => 'Family One',
            'osra_place' => 'Hall A',
            'osra_time' => 'Friday 10:00',
            'osra_code' => 'OSRA-UNIQ-1',
            'example_date' => '2026-12-01',
            'example_time' => '10:00:00',
        ]);

        $this->actingAs($manager)
            ->post('/osras/store', [
                'osra_id' => 999999,
                'osra_name' => 'Family Two',
                'osra_place' => 'Hall B',
                'osra_time' => 'Saturday 12:00',
                'osra_code' => 'OSRA-UNIQ-2',
                'example_date' => '2026-12-02',
                'example_time' => '12:00:00',
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('osra', ['osra_id' => 999999]);
        $this->assertDatabaseHas('osra', ['osra_code' => 'OSRA-UNIQ-2']);

        // Updating keeping own osra_code succeeds
        $this->actingAs($manager)
            ->put("/osras/{$osra1->osra_id}", [
                'osra_name' => 'Family One Updated',
                'osra_place' => 'Hall A2',
                'osra_time' => 'Friday 11:00',
                'osra_code' => 'OSRA-UNIQ-1',
                'example_date' => '2026-12-01',
                'example_time' => '11:00:00',
            ])
            ->assertSessionHasNoErrors();

        // Updating to another Osra's code fails cleanly with validation error (not 500)
        $this->actingAs($manager)
            ->put("/osras/{$osra1->osra_id}", [
                'osra_name' => 'Family One Updated',
                'osra_place' => 'Hall A2',
                'osra_time' => 'Friday 11:00',
                'osra_code' => 'OSRA-UNIQ-2',
                'example_date' => '2026-12-01',
                'example_time' => '11:00:00',
            ])
            ->assertSessionHasErrors('osra_code');
    }

    public function test_user_update_and_profile_update_require_unique_11_digit_mobile(): void
    {
        $manager = User::factory()->manager()->create(['mobile' => '01011112222']);
        $userA = User::factory()->create(['mobile' => '01033334444']);
        $userB = User::factory()->create(['mobile' => '01055556666']);

        $this->actingAs($manager)
            ->put("/users/{$userA->user_id}/update", [
                'full_name' => $userA->full_name,
                'mobile' => 'abc123',
                'email' => $userA->email,
                'user_type' => 'user',
            ])
            ->assertSessionHasErrors('mobile');

        $this->actingAs($manager)
            ->put("/users/{$userA->user_id}/update", [
                'full_name' => $userA->full_name,
                'mobile' => $userB->mobile,
                'email' => $userA->email,
                'user_type' => 'user',
            ])
            ->assertSessionHasErrors('mobile');

        $this->actingAs($userA)
            ->post('/profile/update', [
                'full_name' => $userA->full_name,
                'mobile' => $userB->mobile,
                'email' => $userA->email,
            ])
            ->assertSessionHasErrors('mobile');
    }

    public function test_manager_cannot_delete_own_account_but_can_delete_others(): void
    {
        $manager = User::factory()->manager()->create();
        $other = User::factory()->create();

        $this->actingAs($manager)
            ->delete("/users/{$manager->user_id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('users', ['user_id' => $manager->user_id]);

        $this->actingAs($manager)
            ->delete("/users/{$other->user_id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['user_id' => $other->user_id]);
    }
}
