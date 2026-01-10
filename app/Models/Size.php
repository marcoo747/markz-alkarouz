<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $primaryKey = 'size_id';
    protected $table = 'sizes';

    protected $fillable = [
        'product_id',
        'size',
    ];

    public $timestamps = true;
}
