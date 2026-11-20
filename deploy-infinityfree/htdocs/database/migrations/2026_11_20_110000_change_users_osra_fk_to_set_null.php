<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_osra_id_foreign');
            $table->foreign('osra_id')
                ->references('osra_id')
                ->on('osra')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_osra_id_foreign');
            $table->foreign('osra_id')
                ->references('osra_id')
                ->on('osra')
                ->cascadeOnDelete();
        });
    }
};
