<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class Main_Category extends Model
{
    use HasFactory;

    protected $table = 'main_categories';
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'category_name',
        'category_description',
        'category_photo',
        'can_go_outside',
    ];

    public function products()
    {
        return $this->hasMany(
            Product::class,
            'category_id',
            'category_id'
        );
    }

    public function sub_category()
    {
        return $this->belongsTo(
            Category::class,
            'main_category_id',
            'category_id'
        );
    }
}
