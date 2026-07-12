<?php

namespace App\Models;

use Database\Factories\MediaItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $media_type
 * @property string|null $category
 * @property string|null $image_path
 * @property string|null $video_url
 * @property string|null $caption
 * @property int|null $talent_id
 * @property int $sort_order
 */
#[Fillable([
    'media_type', 'category', 'image_path', 'video_url',
    'caption', 'talent_id', 'sort_order',
])]
class MediaItem extends Model
{
    /** @use HasFactory<MediaItemFactory> */
    use HasFactory;

    public const TYPES = ['image', 'video'];

    public const IMAGE_CATEGORIES = ['Events', 'Matches', 'Agency Activities', 'Player Moments'];

    public const VIDEO_CATEGORIES = ['Interviews', 'Highlights', 'Media Appearances'];

    /**
     * @return BelongsTo<Talent, $this>
     */
    public function talent(): BelongsTo
    {
        return $this->belongsTo(Talent::class);
    }

    /**
     * @param  Builder<MediaItem>  $query
     */
    public function scopeImages(Builder $query): void
    {
        $query->where('media_type', 'image');
    }

    /**
     * @param  Builder<MediaItem>  $query
     */
    public function scopeVideos(Builder $query): void
    {
        $query->where('media_type', 'video');
    }

    /**
     * @param  Builder<MediaItem>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    /**
     * Build an embeddable URL from a YouTube/Vimeo watch URL.
     */
    public function getVideoEmbedUrlAttribute(): ?string
    {
        if (blank($this->video_url)) {
            return null;
        }

        $url = $this->video_url;

        if (Str::contains($url, ['youtube.com/watch', 'youtu.be'])) {
            $id = Str::contains($url, 'youtu.be')
                ? Str::afterLast(Str::before($url, '?'), '/')
                : Str::before(Str::after($url, 'v='), '&');

            return "https://www.youtube.com/embed/{$id}";
        }

        if (Str::contains($url, 'vimeo.com')) {
            $id = Str::afterLast(Str::before($url, '?'), '/');

            return "https://player.vimeo.com/video/{$id}";
        }

        return $url;
    }
}
