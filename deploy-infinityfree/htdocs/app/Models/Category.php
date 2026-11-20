<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'sub_categories';
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'main_category_id',
        'category_name',
        'category_description',
        'category_photo',
    ];

    public function products()
    {
        return $this->hasMany(
            Product::class,
            'category_id',
            'category_id'
        );
    }

    public function main_category()
    {
        return $this->belongsTo(
            Main_Category::class,
            'main_category_id',
            'category_id'
        );
    }
}
