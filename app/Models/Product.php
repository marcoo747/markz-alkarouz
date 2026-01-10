<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Material;
use App\Models\Color;
use App\Models\Cart;
use App\Models\Size;
use App\Models\Product_photos;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'pr_name',
        'brand',
        'pr_description',
        'pr_price',
        'inventory_qnty',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(Product_photos::class, 'product_id', 'product_id');
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'product_id', 'product_id');
    }

    public function colors()
    {
        return $this->hasMany(Color::class, 'product_id', 'product_id');
    }

    public function sizes()
    {
        return $this->hasMany(Size::class, 'product_id', 'product_id');
    }

    public function carts()
    {
        return $this->belongsToMany(
            Cart::class,
            'cart_products',
            'product_id',
            'cart_id'
        )->withTimestamps();
    }
}
