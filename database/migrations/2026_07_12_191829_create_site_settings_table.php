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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('agency_name')->default('CaSe Sports Management');
            $table->string('tagline')->nullable();
            $table->longText('agency_story')->nullable();
            $table->text('mission')->nullable();
            $table->text('vision')->nullable();
            $table->text('fifa_license_info')->nullable();
            $table->json('services')->nullable();   // [{title, description, group}]
            $table->json('stats')->nullable();      // [{value, label}]
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->json('social_links')->nullable(); // {instagram, twitter, facebook, linkedin}
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
