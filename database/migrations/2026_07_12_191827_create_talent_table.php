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
        Schema::create('talents', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('player'); // player | coach
            $table->string('full_name');
            $table->string('slug')->unique();
            $table->string('photo')->nullable();
            $table->string('position')->nullable();
            $table->string('nationality')->nullable();
            $table->string('current_club')->nullable();
            $table->longText('biography')->nullable();
            $table->json('career_history')->nullable(); // [{club, years}]
            $table->json('video_links')->nullable();    // [{label, url}]
            $table->json('gallery_images')->nullable();  // [path]
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('draft'); // draft | published
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->timestamps();

            $table->index(['status', 'type']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('talents');
    }
};
