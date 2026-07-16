<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaFileResource;
use App\Models\MediaFile;
use App\Models\MediaFolder;
use App\Services\MediaLibrary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaFileController extends Controller
{
    public function __construct(protected MediaLibrary $library) {}

    /** Upload one or more files into a folder. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['file', 'max:'.$this->maxUploadKilobytes()],
            'folder_id' => ['nullable', 'integer', 'exists:media_folders,id'],
        ]);

        $folder = isset($data['folder_id'])
            ? MediaFolder::find($data['folder_id'])
            : null;

        $stored = collect($request->file('files'))
            ->map(fn ($file) => $this->library->store($file, $folder, $request->user())->load('uploader:id,name'));

        return response()->json([
            'files' => MediaFileResource::collection($stored),
        ], 201);
    }

    /** Rename a file (display name only, the stored path never changes). */
    public function update(Request $request, MediaFile $file): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
        ]);

        $file->update($data);

        return response()->json(['file' => new MediaFileResource($file->load('uploader:id,name'))]);
    }

    /** Move a file into another folder (or to the root). */
    public function move(Request $request, MediaFile $file): JsonResponse
    {
        $data = $request->validate([
            'folder_id' => ['present', 'nullable', 'integer', 'exists:media_folders,id'],
        ]);

        $file->update(['folder_id' => $data['folder_id']]);

        return response()->json(['file' => new MediaFileResource($file->load('uploader:id,name'))]);
    }

    public function destroy(MediaFile $file): JsonResponse
    {
        $this->library->delete($file);

        return response()->json(['deleted' => true]);
    }

    public function download(MediaFile $file): StreamedResponse
    {
        return Storage::disk($file->storageDisk())->download(
            $file->path,
            $file->name.($file->extension ? '.'.$file->extension : ''),
        );
    }

    /** Create (or refresh) a share link. */
    public function share(Request $request, MediaFile $file): JsonResponse
    {
        $data = $request->validate([
            'expires_at' => ['nullable', 'date', 'after:now'],
            'password' => ['nullable', 'string', 'min:4', 'max:64'],
            'regenerate' => ['boolean'],
        ]);

        $file->share(
            expiresAt: isset($data['expires_at']) ? Carbon::parse($data['expires_at']) : null,
            password: $data['password'] ?? null,
            regenerate: (bool) ($data['regenerate'] ?? false),
        );

        return response()->json(['file' => new MediaFileResource($file->load('uploader:id,name'))]);
    }

    public function revokeShare(MediaFile $file): JsonResponse
    {
        $file->revokeShare();

        return response()->json(['file' => new MediaFileResource($file->load('uploader:id,name'))]);
    }

    protected function maxUploadKilobytes(): int
    {
        return (int) config('media.max_upload_kb', 51200);
    }
}
