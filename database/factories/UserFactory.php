<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'mobile' => '010' . fake()->unique()->numerify('########'),
            'password' => static::$password ??= Hash::make('password'),
            'user_type' => 'user',
            'osra_id' => null,
            'user_photo' => null,
        ];
    }

    public function manager(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_type' => 'manager',
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_type' => 'admin',
        ]);
    }
}
