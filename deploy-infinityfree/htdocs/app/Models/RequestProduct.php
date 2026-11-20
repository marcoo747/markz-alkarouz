<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RequestProduct extends Pivot
{
    protected $table = 'request_products';

    protected $fillable = [
        'request_id',
        'product_id',
        'color_id',
        'size_id',
        'quantity',
        'checked_qnty',
        'unchecked_qnty',
        'comment',
        'created_at',
        'updated_at',
    ];

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }
}
