<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('osra', function (Blueprint $table) {
            $table->id('osra_id');
            $table->string('osra_name')->nullable();
            $table->string('osra_place', 60)->nullable();
            $table->string('osra_time', 50)->nullable();
            $table->string('osra_code', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('osra');
    }
};
