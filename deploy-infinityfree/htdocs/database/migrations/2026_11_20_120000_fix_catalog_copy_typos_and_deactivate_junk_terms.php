<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('sub_categories')
            ->where('category_name', 'speackers')
            ->update(['category_name' => 'Speakers']);

        DB::table('main_categories')
            ->where('category_description', 'LIKE', '%الاكترونيات%')
            ->update([
                'category_description' => DB::raw("REPLACE(category_description, 'الاكترونيات', 'الإلكترونيات')"),
            ]);

        DB::table('products')
            ->where('pr_description', 'LIKE', '%الابتوب%')
            ->update([
                'pr_description' => DB::raw("REPLACE(pr_description, 'الابتوب', 'لابتوب')"),
            ]);

        DB::table('products')
            ->where('pr_description', 'LIKE', '%مكبر صةت%')
            ->update([
                'pr_description' => DB::raw("REPLACE(pr_description, 'مكبر صةت', 'مكبر صوت')"),
            ]);

        DB::table('products')
            ->where('pr_description', 'LIKE', '%من مفس لونه%')
            ->update([
                'pr_description' => DB::raw("REPLACE(pr_description, 'من مفس لونه', 'من نفس لونه')"),
            ]);

        DB::table('terms_and_penalties')
            ->whereIn('title', ['2', '4'])
            ->whereIn('content', ['1', '5'])
            ->update(['is_active' => 0]);
    }

    public function down(): void
    {
        DB::table('sub_categories')
            ->where('category_name', 'Speakers')
            ->update(['category_name' => 'speackers']);
    }
};
