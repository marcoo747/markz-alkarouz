<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Concerns\HasOutsideVisibility;
use App\Models\Main_Category;
use App\Models\Material;
use App\Models\Color;
use App\Models\Cart;
use App\Models\Size;
use App\Models\Product_photos;
use App\Models\UserRequest;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory, HasOutsideVisibility;

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

    public function mainCategory()
    {
        return $this->belongsTo(Main_Category::class, 'main_category_id', 'category_id');
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

    private static function normalizeTime(?string $time, string $fallback = '00:00:00'): string
    {
        $value = trim((string) $time);
        if ($value === '') {
            return $fallback;
        }

        if (preg_match('/^(\d{1,2}):(\d{2})$/', $value, $matches)) {
            return sprintf('%02d:%02d:00', (int) $matches[1], (int) $matches[2]);
        }

        if (preg_match('/^(\d{1,2}):(\d{2}):(\d{2})$/', $value, $matches)) {
            return sprintf('%02d:%02d:%02d', (int) $matches[1], (int) $matches[2], (int) $matches[3]);
        }

        return $fallback;
    }

    public function scopeWithAvailableInWindow($query, $request = null, bool $onlyAvailable = true)
    {
        $req = $request ?: request();

        $timeType        = $req->input('time_type');
        $startDate       = $req->input('start_date') ?: $req->input('date') ?: now()->format('Y-m-d');
        $defaultTime     = now()->format('H:i:00');
        $startTime       = self::normalizeTime($req->input('start_time') ?: $req->input('time'), $defaultTime);
        $endDate         = $req->input('end_date') ?: $startDate;
        $endTime         = self::normalizeTime($req->input('end_time'), $startTime);
        $osraDate        = $req->input('osra_date') ?: $startDate;
        $osraNumericTime = self::normalizeTime($req->input('osra_numeric_time'), $startTime);

        if ($timeType === 'family' || $timeType === 'familyTime') {
            $targetStart = "{$osraDate} {$osraNumericTime}";
            $targetEnd   = "{$osraDate} {$osraNumericTime}";
        } else {
            $targetStart = "{$startDate} {$startTime}";
            $targetEnd   = "{$endDate} {$endTime}";
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
                           ->whereRaw("TIMESTAMP(r.start_date, r.start_time) <= ?", [$targetEnd])
                           ->whereRaw("TIMESTAMP(r.end_date, r.end_time) >= ?", [$targetStart]);
                })
                ->orWhere(function ($osra) use ($targetStart, $targetEnd) {
                    $osra->whereNotNull('r.osra_date')
                         ->whereNotNull('r.osra_numeric_time')
                         ->whereRaw("TIMESTAMP(r.osra_date, r.osra_numeric_time) <= ?", [$targetEnd])
                         ->whereRaw("TIMESTAMP(r.osra_date, r.osra_numeric_time) >= ?", [$targetStart]);
                });
            })
            ->selectRaw('COALESCE(SUM(rp.quantity), 0)');

        $subSql = $requestedQtySubquery->toSql();
        $bindings = $requestedQtySubquery->getBindings();

        $query->select('products.*')
            ->selectSub($requestedQtySubquery, 'requested_quantity');

        if ($onlyAvailable) {
            $query->whereRaw("(COALESCE(products.inventory_quantity, 0) - ({$subSql})) > 0", $bindings);
        }

        return $query;
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
