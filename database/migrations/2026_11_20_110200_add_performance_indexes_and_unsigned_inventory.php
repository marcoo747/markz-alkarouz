<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->whereNull('inventory_quantity')->update(['inventory_quantity' => 0]);
        DB::statement('ALTER TABLE `products` MODIFY `inventory_quantity` INT UNSIGNED NOT NULL DEFAULT 0');

        Schema::table('requests', function (Blueprint $table) {
            $table->index(['request_status', 'expiry_time'], 'requests_status_expiry_idx');
            $table->index(['request_status', 'start_date', 'end_date'], 'requests_status_dates_idx');
            $table->index('osra_date', 'requests_osra_date_idx');
            $table->index('created_at', 'requests_created_at_idx');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('pr_name', 'products_pr_name_idx');
            $table->index('brand', 'products_brand_idx');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('mobile', 'users_mobile_unique');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_mobile_unique');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_pr_name_idx');
            $table->dropIndex('products_brand_idx');
        });

        Schema::table('requests', function (Blueprint $table) {
            $table->dropIndex('requests_status_expiry_idx');
            $table->dropIndex('requests_status_dates_idx');
            $table->dropIndex('requests_osra_date_idx');
            $table->dropIndex('requests_created_at_idx');
        });

        DB::statement('ALTER TABLE `products` MODIFY `inventory_quantity` INT(3) DEFAULT NULL');
    }
};
