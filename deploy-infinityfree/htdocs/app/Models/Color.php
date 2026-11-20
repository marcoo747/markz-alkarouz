<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $primaryKey = 'color_id';
    protected $table = 'colors';

    protected $fillable = [
        'product_id',
        'color',
    ];

    public $timestamps = true;
}