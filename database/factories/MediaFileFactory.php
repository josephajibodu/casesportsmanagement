<?php

namespace Database\Factories;

use App\Models\MediaFile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MediaFile>
 */
class MediaFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->slug(2);

        return [
            'folder_id' => null,
            'disk' => 'public',
            'path' => 'media/'.date('Y/m').'/'.Str::random(20).'.jpg',
            'original_filename' => $name.'.jpg',
            'name' => $name,
            'mime_type' => 'image/jpeg',
            'extension' => 'jpg',
            'size' => fake()->numberBetween(1000, 500000),
            'width' => 800,
            'height' => 600,
            'uploaded_by' => null,
        ];
    }

    public function video(): static
    {
        return $this->state(fn () => [
            'mime_type' => 'video/mp4',
            'extension' => 'mp4',
            'width' => null,
            'height' => null,
        ]);
    }
}
