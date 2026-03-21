<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cart_products', function (Blueprint $table) {
            $table->id('cart_product_id');
            $table->foreignId('cart_id')->nullable()->constrained('cart', 'cart_id')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products', 'product_id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('cart_products');
    }
};
