<?php

namespace Database\Factories;

use App\Models\MediaItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MediaItem>
 */
class MediaItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'media_type' => 'image',
            'category' => fake()->randomElement(MediaItem::IMAGE_CATEGORIES),
            'image_path' => null,
            'video_url' => null,
            'caption' => fake()->sentence(4),
            'talent_id' => null,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'video',
            'category' => fake()->randomElement(MediaItem::VIDEO_CATEGORIES),
            'image_path' => null,
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);
    }
}
