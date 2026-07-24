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
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->foreignId('handled_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('handled_at')->nullable()->after('handled_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('handled_by');
            $table->dropColumn('handled_at');
        });
    }
};
