<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('request_products') && !Schema::hasColumn('request_products', 'shortfall_reason')) {
            Schema::table('request_products', function (Blueprint $table) {
                $table->string('shortfall_reason', 30)->nullable()->after('unchecked_qnty');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('request_products') && Schema::hasColumn('request_products', 'shortfall_reason')) {
            Schema::table('request_products', function (Blueprint $table) {
                $table->dropColumn('shortfall_reason');
            });
        }
    }
};
