<?php

namespace App\Models;

use Database\Factories\TalentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $type
 * @property string $full_name
 * @property string $slug
 * @property string|null $photo
 * @property string|null $position
 * @property int|null $shirt_number
 * @property array<int, string>|null $secondary_positions
 * @property string|null $nationality
 * @property Carbon|null $date_of_birth
 * @property string|null $place_of_birth
 * @property string|null $secondary_nationality
 * @property int|null $height_cm
 * @property int|null $weight_kg
 * @property string|null $preferred_foot
 * @property string|null $current_club
 * @property string|null $contract_status
 * @property Carbon|null $contract_until
 * @property string|null $market_value
 * @property string|null $biography
 * @property array<int, array{club: string, years: string}>|null $career_history
 * @property array<int, array{label: string, url: string}>|null $video_links
 * @property array<int, string>|null $gallery_images
 * @property bool $is_featured
 * @property string $status
 * @property int $sort_order
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property-read int|null $age
 */
#[Fillable([
    'type', 'full_name', 'slug', 'photo', 'position', 'shirt_number',
    'secondary_positions', 'nationality', 'date_of_birth', 'place_of_birth',
    'secondary_nationality', 'height_cm', 'weight_kg', 'preferred_foot',
    'current_club', 'contract_status', 'contract_until', 'market_value',
    'biography', 'career_history', 'video_links', 'video_files',
    'gallery_images', 'is_featured', 'status', 'sort_order',
    'meta_title', 'meta_description',
])]
class Talent extends Model
{
    /** @use HasFactory<TalentFactory> */
    use HasFactory;

    protected $table = 'talents';

    public const TYPES = ['player', 'coach'];

    public const STATUSES = ['draft', 'published'];

    public const PREFERRED_FEET = ['right', 'left', 'both'];

    public const CONTRACT_STATUSES = ['contracted', 'on_loan', 'free_agent', 'youth'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'contract_until' => 'date',
            'secondary_positions' => 'array',
            'career_history' => 'array',
            'video_links' => 'array',
            'video_files' => 'array',
            'gallery_images' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Age in whole years, derived from the date of birth.
     *
     * @return Attribute<int|null, never>
     */
    protected function age(): Attribute
    {
        return Attribute::get(fn (): ?int => $this->date_of_birth?->age);
    }

    protected static function booted(): void
    {
        static::saving(function (Talent $talent): void {
            if (blank($talent->slug) && filled($talent->full_name)) {
                $talent->slug = static::uniqueSlug($talent->full_name, $talent->id);
            }
        });
    }

    public static function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->when($ignoreId, fn (Builder $q) => $q->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Resolve by id for numeric route values (admin) and by slug otherwise (public).
     */
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        if ($field === null && is_numeric($value)) {
            return $this->newQuery()->find($value);
        }

        return parent::resolveRouteBinding($value, $field);
    }

    public function isCoach(): bool
    {
        return $this->type === 'coach';
    }

    /**
     * Public detail route name for this talent, based on its type.
     */
    public function routeName(): string
    {
        return $this->isCoach() ? 'coaches.show' : 'players.show';
    }

    /**
     * Public detail URL for this talent.
     */
    public function publicUrl(): string
    {
        return route($this->routeName(), $this);
    }

    /**
     * @return HasMany<MediaItem, $this>
     */
    public function mediaItems(): HasMany
    {
        return $this->hasMany(MediaItem::class);
    }

    /**
     * @param  Builder<Talent>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /**
     * @param  Builder<Talent>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * @param  Builder<Talent>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('full_name');
    }
}
