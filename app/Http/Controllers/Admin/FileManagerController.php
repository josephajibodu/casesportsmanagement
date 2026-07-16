<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaFileResource;
use App\Http\Resources\MediaFolderResource;
use App\Models\MediaFile;
use App\Models\MediaFolder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FileManagerController extends Controller
{
    /** Standalone File Manager page. */
    public function index(): Response
    {
        return Inertia::render('admin/files');
    }

    /**
     * List folders and files for the current view.
     *
     * Supports folder browsing, search (which spans all folders), type
     * filtering, "recent", and sorting.
     */
    public function browse(Request $request): JsonResponse
    {
        $data = $request->validate([
            'folder_id' => ['nullable', 'integer', 'exists:media_folders,id'],
            'search' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in([...MediaFile::TYPES, 'recent'])],
            'sort' => ['nullable', Rule::in(['name', 'created_at', 'size', 'extension'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ]);

        $search = trim($data['search'] ?? '');
        $type = $data['type'] ?? null;
        $sort = $data['sort'] ?? 'created_at';
        $direction = $data['direction'] ?? 'desc';

        $folder = isset($data['folder_id']) ? MediaFolder::find($data['folder_id']) : null;

        // Searching or filtering by type looks across every folder; plain
        // browsing is scoped to the folder being viewed.
        $isFlatView = filled($search) || filled($type);

        $files = MediaFile::query()
            ->with('uploader:id,name')
            ->when(! $isFlatView, fn ($q) => $q->where('folder_id', $folder?->id))
            ->when(filled($search), fn ($q) => $q->search($search))
            ->when(filled($type) && $type !== 'recent', fn ($q) => $q->ofType($type))
            ->when($type === 'recent', fn ($q) => $q->where('created_at', '>=', now()->subDays(30)))
            ->orderBy($sort, $direction)
            ->get();

        $folders = MediaFolder::query()
            ->withCount(['files', 'children'])
            ->when(! $isFlatView, fn ($q) => $q->where('parent_id', $folder?->id))
            ->when(filled($search), fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->when(filled($type), fn ($q) => $q->whereRaw('1 = 0')) // type filters apply to files only
            ->orderBy('name')
            ->get();

        return response()->json([
            'folder' => $folder ? new MediaFolderResource($folder) : null,
            'breadcrumbs' => $folder
                ? MediaFolderResource::collection($folder->ancestors()->push($folder))
                : MediaFolderResource::collection(collect()),
            'folders' => MediaFolderResource::collection($folders),
            'files' => MediaFileResource::collection($files),
        ]);
    }

    /** Full folder tree for the sidebar and the "move to" picker. */
    public function tree(): JsonResponse
    {
        $folders = MediaFolder::query()
            ->root()
            ->with('children.children.children')
            ->orderBy('name')
            ->get();

        return response()->json([
            'tree' => MediaFolderResource::collection($folders),
        ]);
    }
}
