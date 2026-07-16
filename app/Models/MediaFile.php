<?php

namespace App\Models;

use Database\Factories\MediaFileFactory;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $folder_id
 * @property string $disk
 * @property string $path
 * @property string $original_filename
 * @property string $name
 * @property string|null $mime_type
 * @property string|null $extension
 * @property int $size
 * @property int|null $width
 * @property int|null $height
 * @property int|null $uploaded_by
 * @property string|null $share_token
 * @property Carbon|null $shared_at
 * @property Carbon|null $share_expires_at
 * @property string|null $share_password
 */
#[Fillable([
    'folder_id', 'disk', 'path', 'original_filename', 'name', 'mime_type',
    'extension', 'size', 'width', 'height', 'uploaded_by',
])]
#[Hidden(['share_password'])]
class MediaFile extends Model
{
    /** @use HasFactory<MediaFileFactory> */
    use HasFactory;

    /** Logical type buckets used by the sidebar filters and picker restrictions. */
    public const TYPES = ['image', 'video', 'document', 'other'];

    protected const DOCUMENT_MIMES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'shared_at' => 'datetime',
            'share_expires_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<MediaFolder, $this>
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'folder_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Type helpers
    |--------------------------------------------------------------------------
    */

    public function type(): string
    {
        $mime = (string) $this->mime_type;

        return match (true) {
            Str::startsWith($mime, 'image/') => 'image',
            Str::startsWith($mime, 'video/') => 'video',
            in_array($mime, self::DOCUMENT_MIMES, true) => 'document',
            default => 'other',
        };
    }

    public function isImage(): bool
    {
        return $this->type() === 'image';
    }

    /**
     * Constrain a query to one of the logical type buckets.
     *
     * @param  Builder<MediaFile>  $query
     */
    public function scopeOfType(Builder $query, string $type): void
    {
        match ($type) {
            'image' => $query->where('mime_type', 'like', 'image/%'),
            'video' => $query->where('mime_type', 'like', 'video/%'),
            'document' => $query->whereIn('mime_type', self::DOCUMENT_MIMES),
            'other' => $query->where(function (Builder $q) {
                $q->whereNull('mime_type')
                    ->orWhere(fn (Builder $inner) => $inner
                        ->where('mime_type', 'not like', 'image/%')
                        ->where('mime_type', 'not like', 'video/%')
                        ->whereNotIn('mime_type', self::DOCUMENT_MIMES));
            }),
            default => null,
        };
    }

    /**
     * @param  Builder<MediaFile>  $query
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('original_filename', 'like', "%{$term}%")
                ->orWhere('extension', 'like', "%{$term}%");
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Storage
    |--------------------------------------------------------------------------
    */

    public function storageDisk(): string
    {
        return $this->disk ?: config('media.disk');
    }

    /**
     * Browser-usable URL for the stored file.
     *
     * With media.signed_urls enabled (a bucket with no public domain) this is a
     * short-lived signed URL. Otherwise it is the disk's permanent public URL.
     */
    public function url(): ?string
    {
        return media_url($this->path, $this->storageDisk());
    }

    public function temporaryUrl(?int $minutes = null): ?string
    {
        try {
            return Storage::disk($this->storageDisk())->temporaryUrl(
                $this->path,
                now()->addMinutes($minutes ?? config('media.signed_url_ttl', 60)),
            );
        } catch (\Throwable) {
            return null;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Sharing
    |--------------------------------------------------------------------------
    */

    public function isShared(): bool
    {
        return filled($this->share_token) && ! $this->shareHasExpired();
    }

    public function shareHasExpired(): bool
    {
        return $this->share_expires_at !== null && $this->share_expires_at->isPast();
    }

    public function shareUrl(): ?string
    {
        return filled($this->share_token) ? route('shared-file.show', $this->share_token) : null;
    }

    /**
     * Create a share link, reusing the existing token unless asked to rotate it.
     */
    public function share(?DateTimeInterface $expiresAt = null, ?string $password = null, bool $regenerate = false): self
    {
        if ($regenerate || blank($this->share_token)) {
            $this->share_token = Str::random(48);
            $this->shared_at = now();
        }

        $this->share_expires_at = $expiresAt;

        if ($password !== null) {
            $this->share_password = $password === '' ? null : bcrypt($password);
        }

        $this->save();

        return $this;
    }

    public function revokeShare(): self
    {
        $this->forceFill([
            'share_token' => null,
            'shared_at' => null,
            'share_expires_at' => null,
            'share_password' => null,
        ])->save();

        return $this;
    }
}
