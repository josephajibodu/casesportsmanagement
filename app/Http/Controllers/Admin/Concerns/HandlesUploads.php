<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HandlesUploads
{
    /**
     * Store an uploaded file on the public disk, deleting any previous local file.
     * Returns the new stored path, or the existing value when no new file is provided.
     */
    protected function storeUpload(?UploadedFile $file, string $folder, ?string $existing = null): ?string
    {
        if ($file === null) {
            return $existing;
        }

        $this->deleteUpload($existing);

        return $file->store($folder, 'public');
    }

    /**
     * Delete a stored upload, ignoring remote URLs (e.g. seeded placeholder images).
     */
    protected function deleteUpload(?string $path): void
    {
        if (filled($path) && ! Str::startsWith($path, ['http://', 'https://', '//'])) {
            Storage::disk('public')->delete($path);
        }
    }
}
