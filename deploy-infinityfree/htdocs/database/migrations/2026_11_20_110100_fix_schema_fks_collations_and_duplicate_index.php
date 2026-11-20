<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert utf8mb3 tables before creating string FKs referencing utf8mb4 tables.
        DB::statement('ALTER TABLE `carousel_photos` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        DB::statement('ALTER TABLE `main_categories` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        DB::statement('ALTER TABLE `missings` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');

        DB::statement('DROP INDEX IF EXISTS `osra_code_2` ON `osra`');

        Schema::table('cart_products', function (Blueprint $table) {
            $table->unsignedBigInteger('color_id')->nullable()->change();
            $table->unsignedBigInteger('size_id')->nullable()->change();
            $table->foreign('color_id', 'cart_products_color_id_foreign')
                ->references('color_id')->on('colors')->nullOnDelete();
            $table->foreign('size_id', 'cart_products_size_id_foreign')
                ->references('size_id')->on('sizes')->nullOnDelete();
        });

        Schema::table('request_products', function (Blueprint $table) {
            $table->unsignedBigInteger('color_id')->nullable()->change();
            $table->unsignedBigInteger('size_id')->nullable()->change();
            $table->foreign('color_id', 'request_products_color_id_foreign')
                ->references('color_id')->on('colors')->nullOnDelete();
            $table->foreign('size_id', 'request_products_size_id_foreign')
                ->references('size_id')->on('sizes')->nullOnDelete();
        });

        Schema::table('requests', function (Blueprint $table) {
            $table->foreign('osra_code', 'requests_osra_code_foreign')
                ->references('osra_code')->on('osra')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        Schema::table('missings', function (Blueprint $table) {
            $table->foreign('osra_code', 'missings_osra_code_foreign')
                ->references('osra_code')->on('osra')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        Schema::table('terms_and_penalties', function (Blueprint $table) {
            $table->dropForeign('terms_and_penalties_created_by_foreign');
            $table->dropForeign('terms_and_penalties_updated_by_foreign');
            $table->foreign('created_by', 'terms_and_penalties_created_by_foreign')
                ->references('user_id')->on('users')->nullOnDelete();
            $table->foreign('updated_by', 'terms_and_penalties_updated_by_foreign')
                ->references('user_id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('terms_and_penalties', function (Blueprint $table) {
            $table->dropForeign('terms_and_penalties_created_by_foreign');
            $table->dropForeign('terms_and_penalties_updated_by_foreign');
            $table->foreign('created_by', 'terms_and_penalties_created_by_foreign')
                ->references('user_id')->on('users');
            $table->foreign('updated_by', 'terms_and_penalties_updated_by_foreign')
                ->references('user_id')->on('users');
        });

        Schema::table('missings', function (Blueprint $table) {
            $table->dropForeign('missings_osra_code_foreign');
        });

        Schema::table('requests', function (Blueprint $table) {
            $table->dropForeign('requests_osra_code_foreign');
        });

        Schema::table('request_products', function (Blueprint $table) {
            $table->dropForeign('request_products_color_id_foreign');
            $table->dropForeign('request_products_size_id_foreign');
            $table->integer('color_id')->nullable()->change();
            $table->integer('size_id')->nullable()->change();
        });

        Schema::table('cart_products', function (Blueprint $table) {
            $table->dropForeign('cart_products_color_id_foreign');
            $table->dropForeign('cart_products_size_id_foreign');
            $table->integer('color_id')->nullable()->change();
            $table->integer('size_id')->nullable()->change();
        });
    }
};
