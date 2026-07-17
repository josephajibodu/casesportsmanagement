<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the profile fields scouts expect to see on a player.
     */
    public function up(): void
    {
        Schema::table('talents', function (Blueprint $table) {
            // Personal / physical
            $table->date('date_of_birth')->nullable()->after('nationality');
            $table->string('place_of_birth')->nullable()->after('date_of_birth');
            $table->string('secondary_nationality')->nullable()->after('place_of_birth');
            $table->unsignedSmallInteger('height_cm')->nullable()->after('secondary_nationality');
            $table->unsignedSmallInteger('weight_kg')->nullable()->after('height_cm');
            $table->string('preferred_foot')->nullable()->after('weight_kg'); // left | right | both

            // Playing
            $table->unsignedSmallInteger('shirt_number')->nullable()->after('position');
            $table->json('secondary_positions')->nullable()->after('shirt_number');

            // Contract / representation
            $table->string('contract_status')->nullable()->after('current_club'); // contracted | on_loan | free_agent | youth
            $table->date('contract_until')->nullable()->after('contract_status');
            $table->string('market_value')->nullable()->after('contract_until');
        });
    }

    public function down(): void
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'place_of_birth',
                'secondary_nationality',
                'height_cm',
                'weight_kg',
                'preferred_foot',
                'shirt_number',
                'secondary_positions',
                'contract_status',
                'contract_until',
                'market_value',
            ]);
        });
    }
};
