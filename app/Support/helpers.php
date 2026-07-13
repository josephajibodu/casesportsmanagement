<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

if (! function_exists('media_url')) {
    /**
     * Resolve a media reference to a usable URL.
     *
     * Accepts either an absolute URL (e.g. seeded/remote images) or a path on
     * the public disk (e.g. admin uploads), returning a browser-usable URL.
     */
    function media_url(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '//', '/'])) {
            return $path;
        }

        return Storage::disk(config('media.disk'))->url($path);
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
