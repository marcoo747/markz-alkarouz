<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->foreignId('category_id')->nullable()->constrained('categories', 'category_id')->cascadeOnDelete();
            $table->string('pr_name')->nullable();
            $table->string('brand')->nullable();
            $table->text('pr_description')->nullable();
            $table->decimal('pr_price', 10, 2)->nullable();
            $table->integer('inventory_qnty')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};
