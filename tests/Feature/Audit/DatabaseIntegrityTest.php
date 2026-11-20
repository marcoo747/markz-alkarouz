<?php

namespace Tests\Feature\Audit;

use App\Models\Osra;
use App\Models\User;
use App\Models\UserRequest;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DatabaseIntegrityTest extends TestCase
{
    use DatabaseTransactions;

    public function test_deleting_osra_is_blocked_without_force_and_sets_users_osra_id_null_without_deleting_users_or_requests(): void
    {
        $manager = User::factory()->manager()->create();

        $osra = Osra::create([
            'osra_name' => 'Audit Integrity Osra',
            'osra_place' => 'Hall 1',
            'osra_time' => 'Friday 6 PM',
            'osra_code' => 'AUD_OSRA_' . uniqid(),
            'example_date' => '2026-12-04',
            'example_time' => '18:00:00',
        ]);

        $member = User::factory()->create([
            'osra_id' => $osra->osra_id,
        ]);

        $req = UserRequest::create([
            'user_id' => $member->user_id,
            'request_status' => 'pending',
            'total_price' => 20,
        ]);

        // Deleting an Osra with assigned users is refused unless force=1
        $this->actingAs($manager)
            ->deleteJson(route('osra.destroy', $osra->osra_id))
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Cannot delete this Osra while users are assigned to it.']);

        $this->assertNotNull(Osra::find($osra->osra_id));

        // Force-deleting sets users.osra_id to NULL instead of cascade-deleting the user or requests
        $this->actingAs($manager)
            ->delete(route('osra.destroy', $osra->osra_id), ['force' => true])
            ->assertRedirect();

        $this->assertNull(Osra::find($osra->osra_id));
        $freshMember = $member->fresh();
        $this->assertNotNull($freshMember);
        $this->assertNull($freshMember->osra_id);
        $this->assertNotNull(UserRequest::find($req->request_id));
    }
}
