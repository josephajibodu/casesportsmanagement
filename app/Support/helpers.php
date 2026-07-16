<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

if (! function_exists('media_url')) {
    /**
     * Resolve a media reference to a browser-usable URL.
     *
     * Accepts an absolute URL (e.g. seeded remote images) or a path on the
     * media disk. Works identically on local storage and any S3-compatible
     * provider (R2, MinIO, S3), because the URL always comes from the disk.
     *
     * When media.signed_urls is enabled the bucket has no public domain, so a
     * short-lived signed URL is returned instead of a permanent public one.
     */
    function media_url(?string $path, ?string $disk = null): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '//', '/'])) {
            return $path;
        }

        $storage = Storage::disk($disk ?? config('media.disk'));

        if (config('media.signed_urls')) {
            try {
                return $storage->temporaryUrl($path, now()->addMinutes(config('media.signed_url_ttl', 60)));
            } catch (Throwable) {
                // Driver cannot sign (e.g. the local disk); fall through.
            }
        }

        try {
            return $storage->url($path);
        } catch (RuntimeException) {
            return null;
        }
    }
}

if (! function_exists('video_embed_url')) {
    /**
     * Convert a YouTube/Vimeo watch URL into an embeddable player URL.
     */
    function video_embed_url(?string $url): ?string
    {
        if (blank($url)) {
            return null;
        }

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
