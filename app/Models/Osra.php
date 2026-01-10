<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Osra extends Model
{
    protected $primaryKey = 'osra_id';
    protected $table = 'osra';
    protected $fillable = [
        'osra_name',
        'osra_place',
        'osra_time',
        'osra_code',
    ];

    public function requests()
    {
        return $this->hasMany(UserRequest::class, 'osra_id', 'osra_id');
    }
}
