<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $agency_name
 * @property string|null $tagline
 * @property string|null $agency_story
 * @property string|null $mission
 * @property string|null $vision
 * @property string|null $fifa_license_info
 * @property array<int, array{title: string, description: string, group: string}>|null $services
 * @property array<int, array{value: string, label: string}>|null $stats
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address_line1
 * @property string|null $address_line2
 * @property string|null $city
 * @property string|null $province
 * @property string|null $country
 * @property array<string, string>|null $social_links
 */
#[Fillable([
    'agency_name', 'tagline', 'agency_story', 'mission', 'vision',
    'fifa_license_info', 'services', 'stats', 'email', 'phone',
    'address_line1', 'address_line2', 'city', 'province', 'country',
    'social_links',
])]
class SiteSetting extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'services' => 'array',
            'stats' => 'array',
            'social_links' => 'array',
        ];
    }

    /**
     * The address as an ordered list of non-empty lines.
     *
     * @return array<int, string>
     */
    public function addressLines(): array
    {
        return array_values(array_filter([
            $this->address_line1,
            $this->address_line2,
            trim(implode(', ', array_filter([$this->city, $this->province]))),
            $this->country,
        ], fn ($line) => filled($line)));
    }

    /**
     * The full address on a single line.
     */
    public function getFormattedAddressAttribute(): string
    {
        return implode(', ', $this->addressLines());
    }

    /**
     * Get the singleton settings record, creating a blank one if missing.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
