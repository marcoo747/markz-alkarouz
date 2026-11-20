<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id'); // matches your SQL schema
            $table->foreignId('osra_id')->nullable()->constrained('osra', 'osra_id')->cascadeOnDelete();
            $table->string('user_type')->nullable(); // custom field
            $table->string('full_name'); // user full name
            $table->string('mobile', 20)->nullable(); // phone number
            $table->string('email')->nullable()->unique(); // for auth
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password'); // hashed password for auth
            $table->string('user_photo')->nullable(); // profile photo
            $table->rememberToken(); // for "remember me"
            $table->timestamps();
        });

        // Optional: password reset table
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Optional: sessions table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
