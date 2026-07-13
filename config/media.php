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

];
