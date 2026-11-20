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
use Illuminate\Support\Facades\DB;

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

    public function scopeWithAvailableInWindow($query, $request = null)
    {
        $req = $request ?: request();

        $timeType        = $req->input('time_type');
        $startDate       = $req->input('start_date') ?: $req->input('date') ?: now()->format('Y-m-d');
        $startTime       = $req->input('start_time') ?: $req->input('time') ?: now()->format('H:i');
        $endDate         = $req->input('end_date') ?: $startDate;
        $endTime         = $req->input('end_time') ?: $startTime;
        $osraDate        = $req->input('osra_date') ?: $startDate;
        $osraNumericTime = $req->input('osra_numeric_time') ?: $startTime;

        if ($timeType === 'family' || $timeType === 'familyTime') {
            $targetStart = "{$osraDate} {$osraNumericTime}:00";
            $targetEnd   = "{$osraDate} {$osraNumericTime}:00";
        } else {
            $targetStart = "{$startDate} {$startTime}:00";
            $targetEnd   = "{$endDate} {$endTime}:00";
        }

        $requestedQtySubquery = DB::table('request_products as rp')
            ->join('requests as r', 'rp.request_id', '=', 'r.request_id')
            ->whereColumn('rp.product_id', 'products.product_id')
            ->where(function ($q) {
                $q->whereNull('r.request_status')
                  ->orWhereNotIn('r.request_status', ['done', 'rejected']);
            })
            ->where(function ($q) use ($targetStart, $targetEnd) {
                $q->where(function ($custom) use ($targetStart, $targetEnd) {
                    $custom->whereNotNull('r.start_date')
                           ->whereNotNull('r.start_time')
                           ->whereNotNull('r.end_date')
                           ->whereNotNull('r.end_time')
                           ->whereRaw("CONCAT(r.start_date, ' ', r.start_time, ':00') <= ?", [$targetEnd])
                           ->whereRaw("CONCAT(r.end_date, ' ', r.end_time, ':00') >= ?", [$targetStart]);
                })
                ->orWhere(function ($osra) use ($targetStart, $targetEnd) {
                    $osra->whereNotNull('r.osra_date')
                         ->whereNotNull('r.osra_numeric_time')
                         ->whereRaw("CONCAT(r.osra_date, ' ', r.osra_numeric_time, ':00') <= ?", [$targetEnd])
                         ->whereRaw("CONCAT(r.osra_date, ' ', r.osra_numeric_time, ':00') >= ?", [$targetStart]);
                });
            })
            ->selectRaw('COALESCE(SUM(rp.quantity), 0)');

        $subSql = $requestedQtySubquery->toSql();
        $bindings = $requestedQtySubquery->getBindings();

        return $query->select('products.*')
            ->selectSub($requestedQtySubquery, 'requested_quantity')
            ->whereRaw("(products.inventory_quantity - ({$subSql})) > 0", $bindings);
    }

    public function scopeAvailableAt($query, $date, $time)
    {
        if (!$date || !$time) {
            return $query;
        }

        return $this->scopeWithAvailableInWindow($query);
    }

    /**
     * Check if a given time window overlaps with an active request.
     */
    private static function overlapsWindow($q, $startDate, $startTime, $endDate, $endTime)
    {
        $q->where(function ($interval) use ($startDate, $startTime, $endDate, $endTime) {
            $interval->whereNotNull('start_date')
                ->whereNotNull('start_time')
                ->whereNotNull('end_date')
                ->whereNotNull('end_time')
                ->where(function ($range) use ($startDate, $startTime, $endDate, $endTime) {
                    // Request start is before our end AND request end is after our start
                    $range->where(function ($reqStart) use ($endDate, $endTime) {
                        $reqStart->where('start_date', '<', $endDate)
                            ->orWhere(function ($s) use ($endDate, $endTime) {
                                $s->where('start_date', $endDate)->where('start_time', '<=', $endTime);
                            });
                    })->where(function ($reqEnd) use ($startDate, $startTime) {
                        $reqEnd->where('end_date', '>', $startDate)
                            ->orWhere(function ($e) use ($startDate, $startTime) {
                                $e->where('end_date', $startDate)->where('end_time', '>=', $startTime);
                            });
                    });
                });
        })->orWhere(function ($osraMatch) use ($startDate, $startTime) {
            $osraMatch->where('osra_date', $startDate)
                ->where('osra_numeric_time', $startTime);
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
