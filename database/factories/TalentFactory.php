<?php

namespace Database\Factories;

use App\Models\Talent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Talent>
 */
class TalentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name('male');

        return [
            'type' => fake()->randomElement(['player', 'coach']),
            'full_name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 99999),
            'photo' => null,
            'position' => fake()->randomElement(['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST']),
            'nationality' => fake()->country(),
            'current_club' => fake()->company().' FC',
            'biography' => fake()->paragraphs(3, true),
            'career_history' => [
                ['club' => fake()->company().' FC', 'years' => '2018–2021'],
                ['club' => fake()->company().' FC', 'years' => '2021–Present'],
            ],
            'video_links' => [
                ['label' => 'Season Highlights', 'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ],
            'gallery_images' => null,
            'is_featured' => fake()->boolean(30),
            'status' => 'published',
            'sort_order' => fake()->numberBetween(0, 100),
            'meta_title' => null,
            'meta_description' => null,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => ['is_featured' => true]);
    }

    public function player(): static
    {
        return $this->state(fn (array $attributes) => ['type' => 'player']);
    }

    public function coach(): static
    {
        return $this->state(fn (array $attributes) => ['type' => 'coach']);
    }
}
