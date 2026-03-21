<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRequest extends Model
{
    protected $table = 'requests';
    protected $primaryKey = 'request_id';
    public $timestamps = true;

    protected $appends = ['display_time'];
    protected $fillable = [
        'user_id',
        'osra_id',
        'osra_code',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'osra_time',
        'request_status',
        'total_price',
    ];

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'request_products',
            'request_id',
            'product_id'
        )
        ->using(RequestProduct::class)
        ->withPivot(['color_id', 'size_id', 'quantity'])
        ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function osra()
    {
        return $this->belongsTo(
            Osra::class,
            'osra_code',
            'osra_code'
        );
    }

    public function getDisplayTimeAttribute()
    {
        if ($this->osra_time) {
            return $this->osra_time;
        }

        if ($this->start_date && $this->start_time && $this->end_date && $this->end_time) {
            return "{$this->start_date} {$this->start_time} → {$this->end_date} {$this->end_time}";
        }

        return null;
    }
}
