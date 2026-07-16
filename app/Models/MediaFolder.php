<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property int $id
 * @property string $name
 * @property int|null $parent_id
 * @property int|null $created_by
 */
#[Fillable(['name', 'parent_id', 'created_by'])]
class MediaFolder extends Model
{
    /**
     * @return BelongsTo<MediaFolder, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'parent_id');
    }

    /**
     * @return HasMany<MediaFolder, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(MediaFolder::class, 'parent_id');
    }

    /**
     * @return HasMany<MediaFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'folder_id');
    }

    /**
     * @param  Builder<MediaFolder>  $query
     */
    public function scopeRoot(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * Ancestors from the root down to (but excluding) this folder.
     *
     * @return Collection<int, MediaFolder>
     */
    public function ancestors(): Collection
    {
        $chain = collect();
        $current = $this->parent;

        while ($current !== null) {
            $chain->prepend($current);
            $current = $current->parent;
        }

        return $chain;
    }

    /**
     * This folder's id plus every descendant id, for recursive queries.
     *
     * @return array<int, int>
     */
    public function selfAndDescendantIds(): array
    {
        $ids = [$this->id];

        foreach ($this->children as $child) {
            $ids = array_merge($ids, $child->selfAndDescendantIds());
        }

        return $ids;
    }

    /**
     * Guard against moving a folder inside itself or one of its descendants.
     */
    public function wouldCreateCycle(?int $newParentId): bool
    {
        return $newParentId !== null && in_array($newParentId, $this->selfAndDescendantIds(), true);
    }
}
