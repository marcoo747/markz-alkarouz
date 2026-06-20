<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Missings extends Model
{
    protected $primaryKey = 'missings_id ';
    protected $table = 'missings';

    protected $fillable = [
        'request_id',
        'osra_code',
        'user_id',
        'product_id',
        'quantity',
        'comment',
    ];
}
