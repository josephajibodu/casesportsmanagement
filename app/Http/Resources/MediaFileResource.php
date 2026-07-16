<?php

namespace App\Http\Resources;

use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MediaFile
 */
class MediaFileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'folder_id' => $this->folder_id,
            'name' => $this->name,
            'original_filename' => $this->original_filename,
            'mime_type' => $this->mime_type,
            'extension' => $this->extension,
            'type' => $this->type(),
            'size' => $this->size,
            'size_for_humans' => $this->sizeForHumans(),
            'width' => $this->width,
            'height' => $this->height,
            'path' => $this->path,
            'url' => $this->url(),
            'uploaded_by' => $this->whenLoaded('uploader', fn () => $this->uploader?->name),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_for_humans' => $this->created_at?->diffForHumans(),
            'is_shared' => $this->isShared(),
            'share_url' => $this->shareUrl(),
            'shared_at' => $this->shared_at?->toIso8601String(),
            'share_expires_at' => $this->share_expires_at?->toIso8601String(),
            'share_has_password' => filled($this->share_password),
        ];
    }

    protected function sizeForHumans(): string
    {
        $bytes = (int) $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = $bytes > 0 ? (int) floor(log($bytes, 1024)) : 0;
        $power = min($power, count($units) - 1);

        return round($bytes / (1024 ** $power), $power === 0 ? 0 : 1).' '.$units[$power];
    }
}
