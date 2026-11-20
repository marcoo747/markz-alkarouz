<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'cart';
    protected $primaryKey = 'cart_id';

    protected $fillable = [
        'user_id',
    ];

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'cart_products',
            'cart_id',
            'product_id'
        )
        ->using(CartProduct::class)
        ->withPivot(['color_id', 'size_id', 'quantity'])
        ->withTimestamps()
        ->with('images');
    }
}
