<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('talents', function (Blueprint $table) {
            // Uploaded highlight videos (S3-compatible): [{ label, path }]
            $table->json('video_files')->nullable()->after('video_links');
        });
    }

    public function down(): void
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->dropColumn('video_files');
        });
    }
};
