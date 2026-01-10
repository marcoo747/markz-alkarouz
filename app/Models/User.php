<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Osra;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'full_name',
        'mobile',
        'password',
        'user_photo',
        'user_type',
        'osra_id',
        'email',
    ];

    protected $hidden = [
        'password',
    ];

    public function requests()
    {
        return $this->hasMany(UserRequest::class, 'user_id', 'user_id');
    }

    public function osra()
    {
        return $this->belongsTo(Osra::class, 'osra_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class, 'user_id', 'user_id');
    }

    public function cartProducts()
    {
        return $this->hasManyThrough(
            Product::class,
            Cart::class,
            'user_id',
            'product_id',
            'user_id',
            'cart_id'
        );
    }
}