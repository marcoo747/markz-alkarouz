<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sizes', function (Blueprint $table) {
            $table->id('size_id');
            $table->foreignId('product_id')->nullable()->constrained('products', 'product_id')->cascadeOnDelete();
            $table->string('size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sizes');
    }
};
