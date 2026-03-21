<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RequestProduct extends Pivot
{
    protected $table = 'request_products';

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }
}
