<?php

namespace App\Models;

use Database\Factories\NewsArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string|null $body
 * @property string|null $featured_image
 * @property string|null $category
 * @property Carbon|null $published_at
 * @property string $status
 * @property string|null $meta_title
 * @property string|null $meta_description
 */
#[Fillable([
    'title', 'slug', 'excerpt', 'body', 'featured_image', 'category',
    'published_at', 'status', 'meta_title', 'meta_description',
])]
class NewsArticle extends Model
{
    /** @use HasFactory<NewsArticleFactory> */
    use HasFactory;

    public const CATEGORIES = [
        'Player Updates',
        'Agency Announcements',
        'Press Mentions',
        'Football Updates',
    ];

    public const STATUSES = ['draft', 'published'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (NewsArticle $article): void {
            if (blank($article->slug) && filled($article->title)) {
                $article->slug = static::uniqueSlug($article->title, $article->id);
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
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

    /**
     * @param  Builder<NewsArticle>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
