<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product_photos extends Model
{
    protected $primaryKey = 'photo_id';
    protected $table = 'pr_photos';
    protected $fillable = ['product_id', 'photo'];
    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->photo);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
