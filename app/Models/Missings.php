<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Missings extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'missings_id';
    protected $table = 'missings';

    protected $fillable = [
        'request_id',
        'osra_code',
        'user_id',
        'product_id',
        'quantity',
        'comment',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function osra()
    {
        return $this->belongsTo(Osra::class, 'osra_code', 'osra_code');
    }

    public function request()
    {
        return $this->belongsTo(UserRequest::class, 'request_id');
    }
}
