<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('request_products', function (Blueprint $table) {
            $table->id('request_product_id');
            $table->foreignId('request_id')->nullable()->constrained('requests', 'request_id')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products', 'product_id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('request_products');
    }
};
