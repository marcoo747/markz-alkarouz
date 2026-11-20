<?php

namespace Tests\Feature\Audit;

use App\Models\TermsAndPenalty;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class TermsAndPenaltiesAuthTest extends TestCase
{
    use DatabaseTransactions;

    public function test_guests_get_401_on_terms_api_and_non_managers_cannot_mutate(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $manager = User::factory()->manager()->create();

        $term = TermsAndPenalty::create([
            'title' => 'Sample Term',
            'content' => 'Return on time.',
            'type' => 'terms',
            'is_active' => true,
            'created_by' => $manager->user_id,
            'updated_by' => $manager->user_id,
        ]);

        // Guest
        $this->getJson('/api/terms-penalties')->assertStatus(401);
        $this->postJson('/api/terms-penalties', [
            'title' => 'Hack',
            'content' => 'Bad',
            'type' => 'terms',
        ])->assertStatus(401);

        // Regular user can read, cannot create/update/delete
        $this->actingAs($user)->getJson('/api/terms-penalties')->assertOk();
        $this->actingAs($user)->postJson('/api/terms-penalties', [
            'title' => 'Hack',
            'content' => 'Bad',
            'type' => 'terms',
        ])->assertStatus(403);
        $this->actingAs($user)->putJson("/api/terms-penalties/{$term->id}", [
            'title' => 'Hack Edit',
            'content' => 'Bad Edit',
            'type' => 'terms',
        ])->assertStatus(403);
        $this->actingAs($user)->deleteJson("/api/terms-penalties/{$term->id}")->assertStatus(403);

        // Admin cannot mutate manager-only endpoint
        $this->actingAs($admin)->postJson('/api/terms-penalties', [
            'title' => 'Admin Attempt',
            'content' => 'No',
            'type' => 'terms',
        ])->assertStatus(403);

        // Manager full CRUD works
        $created = $this->actingAs($manager)->postJson('/api/terms-penalties', [
            'title' => 'Manager Term',
            'content' => 'Valid term',
            'type' => 'terms',
        ])->assertStatus(201)->json('item.id');

        $this->actingAs($manager)->putJson("/api/terms-penalties/{$created}", [
            'title' => 'Updated Term',
            'content' => 'Updated text',
            'type' => 'terms',
        ])->assertOk();

        $this->actingAs($manager)->deleteJson("/api/terms-penalties/{$created}")->assertOk();
    }
}
