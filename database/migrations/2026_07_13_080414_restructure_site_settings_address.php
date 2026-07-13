<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('address_line1')->nullable()->after('phone');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('city')->nullable()->after('address_line2');
            $table->string('province')->nullable()->after('city');
            $table->string('country')->nullable()->after('province');
        });

        // Preserve any existing single-line address in the first line.
        foreach (DB::table('site_settings')->get() as $row) {
            if (filled($row->address ?? null)) {
                $lines = preg_split('/\r\n|\r|\n/', trim($row->address));
                DB::table('site_settings')->where('id', $row->id)->update([
                    'address_line1' => $lines[0] ?? null,
                    'city' => $lines[1] ?? null,
                    'country' => $lines[2] ?? null,
                ]);
            }
        }

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('address');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('address')->nullable()->after('phone');
            $table->dropColumn(['address_line1', 'address_line2', 'city', 'province', 'country']);
        });
    }
};
