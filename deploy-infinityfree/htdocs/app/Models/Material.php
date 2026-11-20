<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $primaryKey = 'material_id';
    protected $table = 'materials';

    protected $fillable = [
        'product_id',
        'material_name',
    ];

    public $timestamps = true;
}