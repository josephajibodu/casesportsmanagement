<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'title' => fake()->randomElement(['Managing Director', 'Head of Recruitment', 'Legal Counsel', 'Player Liaison']),
            'photo' => null,
            'bio' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
