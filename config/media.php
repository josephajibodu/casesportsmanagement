<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Media storage disk
    |--------------------------------------------------------------------------
    |
    | Disk used for all admin-uploaded media (photos, logos, gallery images,
    | and highlight videos). Defaults to the local "public" disk for
    | development. In production set MEDIA_DISK=s3 and configure the S3 /
    | MinIO / R2 credentials (AWS_* env vars) to serve media from
    | S3-compatible object storage.
    |
    */

    'disk' => env('MEDIA_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Maximum upload size (kilobytes)
    |--------------------------------------------------------------------------
    |
    | Applied to every file uploaded through the admin File Manager. Keep this
    | in step with the web server's upload_max_filesize / post_max_size.
    |
    */

    'max_upload_kb' => (int) env('MEDIA_MAX_UPLOAD_KB', 51200), // 50 MB

    /*
    |--------------------------------------------------------------------------
    | Signed URLs
    |--------------------------------------------------------------------------
    |
    | Enable only when the media bucket has no public domain. Every media URL
    | then becomes a short-lived signed URL.
    |
    | Leave this false for the public website: signed URLs expire, which breaks
    | browser and CDN caching and is no good for SEO. The recommended R2 setup
    | is a public custom domain in R2_URL, which yields permanent URLs.
    |
    */

    'signed_urls' => (bool) env('MEDIA_SIGNED_URLS', false),

    'signed_url_ttl' => (int) env('MEDIA_SIGNED_URL_TTL', 60), // minutes

];
