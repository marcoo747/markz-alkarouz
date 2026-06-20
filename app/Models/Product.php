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
use App\Models\UserRequest;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'main_category_id',
        'pr_name',
        'brand',
        'pr_description',
        'pr_price',
        'inventory_quantity',
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

    public function requests()
    {
        return $this->belongsToMany(
            UserRequest::class,
            'request_products',
            'product_id',
            'request_id'
        );
    }

    public function scopeAvailableAt($query, $date, $time)
    {
        if (!$date || !$time) {
            return $query;
        }

        return $query->whereDoesntHave('requests', function ($requestQuery) use ($date, $time) {
            $requestQuery->where(function ($statusQuery) {
                $statusQuery->where('request_status', '!=', 'done')
                    ->orWhereNull('request_status');
            })->where(function ($q) use ($date, $time) {
                $q->where(function ($interval) use ($date, $time) {
                    $interval->whereNotNull('start_date')
                        ->whereNotNull('start_time')
                        ->whereNotNull('end_date')
                        ->whereNotNull('end_time')
                        ->where(function ($range) use ($date, $time) {
                            $range->where(function ($start) use ($date, $time) {
                                $start->where('start_date', '<', $date)
                                    ->orWhere(function ($startSame) use ($date, $time) {
                                        $startSame->where('start_date', $date)
                                            ->where('start_time', '<=', $time);
                                    });
                            })
                            ->where(function ($end) use ($date, $time) {
                                $end->where('end_date', '>', $date)
                                    ->orWhere(function ($endSame) use ($date, $time) {
                                        $endSame->where('end_date', $date)
                                            ->where('end_time', '>=', $time);
                                    });
                            });
                        });
                })->orWhere(function ($osra) use ($date, $time) {
                    $osra->where('osra_date', $date)
                        ->where('osra_numeric_time', $time);
                });
            });
        });
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
