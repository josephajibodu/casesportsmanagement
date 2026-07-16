<?php

namespace App\Services;

use App\Models\MediaFile;
use App\Models\MediaFolder;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Stores and removes files for the admin File Manager.
 *
 * Folders are virtual (rows in media_folders) rather than physical directories.
 * Files always live under a date-partitioned prefix on the configured disk, so
 * renaming or moving a folder never has to touch the storage driver. This keeps
 * the manager fast and identical across local, S3, MinIO and R2.
 */
class MediaLibrary
{
    public function disk(): string
    {
        return config('media.disk');
    }

    public function store(UploadedFile $file, ?MediaFolder $folder = null, ?User $user = null): MediaFile
    {
        $disk = $this->disk();
        $path = $file->store('media/'.date('Y/m'), $disk);

        [$width, $height] = $this->dimensions($file);

        return MediaFile::create([
            'folder_id' => $folder?->id,
            'disk' => $disk,
            'path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'name' => Str::limit(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME), 120, ''),
            'mime_type' => $file->getClientMimeType(),
            'extension' => Str::lower($file->getClientOriginalExtension()),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'uploaded_by' => $user?->id,
        ]);
    }

    public function delete(MediaFile $file): void
    {
        Storage::disk($file->storageDisk())->delete($file->path);

        $file->delete();
    }

    /**
     * Delete a folder along with every descendant folder and their files.
     */
    public function deleteFolder(MediaFolder $folder): void
    {
        $ids = $folder->selfAndDescendantIds();

        MediaFile::whereIn('folder_id', $ids)->each(fn (MediaFile $file) => $this->delete($file));

        // Children cascade at the database level.
        $folder->delete();
    }

    /**
     * @return array{0: int|null, 1: int|null}
     */
    protected function dimensions(UploadedFile $file): array
    {
        if (! Str::startsWith((string) $file->getClientMimeType(), 'image/')) {
            return [null, null];
        }

        $size = @getimagesize($file->getRealPath());

        return $size ? [$size[0], $size[1]] : [null, null];
    }
}
