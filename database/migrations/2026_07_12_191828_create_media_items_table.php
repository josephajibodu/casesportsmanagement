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
        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->string('media_type')->default('image'); // image | video
            $table->string('category')->nullable(); // Events, Matches, Interviews, Highlights...
            $table->string('image_path')->nullable(); // for images
            $table->string('video_url')->nullable();  // for video embeds (YouTube/Vimeo)
            $table->string('caption')->nullable();
            $table->foreignId('talent_id')->nullable()->constrained('talents')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['media_type', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_items');
    }
};
