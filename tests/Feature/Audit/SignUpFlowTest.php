<?php

namespace Tests\Feature\Audit;

use App\Models\Osra;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SignUpFlowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_sign_up_validation_failure_redirects_without_500_and_json_returns_422(): void
    {
        $this->from('/sign_up')
            ->post(route('sign_up.store'), [
                'full_name' => 'Audit SignUp User',
                'email' => 'signup.invalid@example.test',
                'mobile' => '01234',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ])
            ->assertRedirect('/sign_up')
            ->assertSessionHasErrors('mobile');

        $this->postJson(route('sign_up.store'), [
            'full_name' => 'Audit SignUp User',
            'email' => 'signup.invalid@example.test',
            'mobile' => '01234',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('mobile');
    }

    public function test_sign_up_succeeds_with_osra_code_and_ignores_elevated_user_type(): void
    {
        $osra = Osra::create([
            'osra_name' => 'Audit SignUp Osra',
            'osra_place' => 'Hall 2',
            'osra_time' => 'Sunday 5 PM',
            'osra_code' => 'SUP_' . uniqid(),
            'example_date' => '2026-12-06',
            'example_time' => '17:00:00',
        ]);

        $mobile = '010' . str_pad((string) random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        $email = 'signup.' . uniqid() . '@example.test';

        $this->post(route('sign_up.store'), [
            'full_name' => 'Valid SignUp Member',
            'email' => $email,
            'mobile' => $mobile,
            'osra_code' => $osra->osra_code,
            'user_type' => 'manager',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
            ->assertRedirect(route('home'));

        $created = User::where('email', $email)->firstOrFail();
        $this->assertSame('user', $created->user_type);
        $this->assertSame($osra->osra_id, $created->osra_id);
        $this->assertAuthenticatedAs($created);
    }

    public function test_manager_register_creates_user_and_rejects_invalid_mobile_without_500(): void
    {
        $manager = User::factory()->manager()->create();

        $this->actingAs($manager)
            ->from('/register')
            ->post(route('register.store'), [
                'full_name' => 'Bad Mobile',
                'email' => 'bad.mobile@example.test',
                'mobile' => '999',
                'user_type' => 'user',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ])
            ->assertRedirect('/register')
            ->assertSessionHasErrors('mobile');

        $mobile = '011' . str_pad((string) random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        $email = 'registered.' . uniqid() . '@example.test';

        $this->actingAs($manager)
            ->post(route('register.store'), [
                'full_name' => 'Manager Created User',
                'email' => $email,
                'mobile' => $mobile,
                'user_type' => 'admin',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ])
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'user_type' => 'admin',
        ]);
    }
}
