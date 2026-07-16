<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaFolderResource;
use App\Models\MediaFolder;
use App\Services\MediaLibrary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MediaFolderController extends Controller
{
    public function __construct(protected MediaLibrary $library) {}

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'parent_id' => ['nullable', 'integer', 'exists:media_folders,id'],
        ]);

        $this->assertNameIsFree($data['name'], $data['parent_id'] ?? null);

        $folder = MediaFolder::create([
            'name' => $data['name'],
            'parent_id' => $data['parent_id'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return response()->json(['folder' => new MediaFolderResource($folder)], 201);
    }

    /** Rename and/or move a folder. */
    public function update(Request $request, MediaFolder $folder): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'parent_id' => ['sometimes', 'nullable', 'integer', Rule::exists('media_folders', 'id')],
        ]);

        if (array_key_exists('parent_id', $data) && $folder->wouldCreateCycle($data['parent_id'])) {
            throw ValidationException::withMessages([
                'parent_id' => 'A folder cannot be moved inside itself.',
            ]);
        }

        $this->assertNameIsFree(
            $data['name'] ?? $folder->name,
            array_key_exists('parent_id', $data) ? $data['parent_id'] : $folder->parent_id,
            $folder->id,
        );

        $folder->update($data);

        return response()->json(['folder' => new MediaFolderResource($folder)]);
    }

    public function destroy(MediaFolder $folder): JsonResponse
    {
        $this->library->deleteFolder($folder);

        return response()->json(['deleted' => true]);
    }

    /** Folder names must be unique within their parent. */
    protected function assertNameIsFree(string $name, ?int $parentId, ?int $ignoreId = null): void
    {
        $exists = MediaFolder::query()
            ->where('parent_id', $parentId)
            ->where('name', $name)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'name' => 'A folder with this name already exists here.',
            ]);
        }
    }
}
