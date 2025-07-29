<?php

namespace Database\Factories;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password = '12345';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'user_type' => UserType::User->value, // Default to User type
            'national_id' => fake()->unique()->numerify('###########'),
            'phone_number' => fake()->unique()->numerify('01#########'),
            'credit_card_number' => fake()->optional()->randomElement(['TEST_CARD_1', 'TEST_CARD_2']), // Security: use test values instead of real credit card numbers
            'wallet_balance' => fake()->optional()->randomElement([100, 200, 500]), // Security: use fixed test values
            'password' => static::$password
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}