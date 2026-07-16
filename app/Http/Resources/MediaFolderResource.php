<?php

namespace App\Http\Resources;

use App\Models\MediaFolder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MediaFolder
 */
class MediaFolderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'parent_id' => $this->parent_id,
            'files_count' => $this->whenCounted('files'),
            'children_count' => $this->whenCounted('children'),
            'created_at' => $this->created_at?->toIso8601String(),
            'children' => MediaFolderResource::collection($this->whenLoaded('children')),
        ];
    }
}
