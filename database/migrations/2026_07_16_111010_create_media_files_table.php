<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->nullable()->constrained('media_folders')->nullOnDelete();

            $table->string('disk');
            $table->string('path', 500);
            $table->string('original_filename');
            $table->string('name'); // display name, editable
            $table->string('mime_type')->nullable();
            $table->string('extension', 20)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();

            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();

            // Sharing
            $table->string('share_token', 64)->nullable()->unique();
            $table->timestamp('shared_at')->nullable();
            $table->timestamp('share_expires_at')->nullable();
            $table->string('share_password')->nullable();

            $table->timestamps();

            $table->index('folder_id');
            $table->index('mime_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
