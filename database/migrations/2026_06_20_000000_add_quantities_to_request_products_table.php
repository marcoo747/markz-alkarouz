<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('request_products', function (Blueprint $table) {
            if (!Schema::hasColumn('request_products', 'color_id')) {
                $table->foreignId('color_id')->nullable()->constrained('colors', 'color_id')->nullOnDelete();
            }

            if (!Schema::hasColumn('request_products', 'size_id')) {
                $table->foreignId('size_id')->nullable()->constrained('sizes', 'size_id')->nullOnDelete();
            }

            if (!Schema::hasColumn('request_products', 'quantity')) {
                $table->unsignedInteger('quantity')->default(0);
            }

            if (!Schema::hasColumn('request_products', 'checked_qnty')) {
                $table->unsignedInteger('checked_qnty')->default(0);
            }

            if (!Schema::hasColumn('request_products', 'unchecked_qnty')) {
                $table->unsignedInteger('unchecked_qnty')->default(0);
            }
        });
    }

    public function down(): void {
        Schema::table('request_products', function (Blueprint $table) {
            $table->dropForeign(['color_id']);
            $table->dropForeign(['size_id']);
            $table->dropColumn(['color_id', 'size_id', 'quantity', 'checked_qnty', 'unchecked_qnty']);
        });
    }
};
