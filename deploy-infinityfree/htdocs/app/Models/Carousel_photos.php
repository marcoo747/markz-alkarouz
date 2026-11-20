<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel_photos extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'carousel_photos';
    protected $fillable = ['photo'];

    public $timestamps = true;
}
