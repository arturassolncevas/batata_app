<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeasurementUnit extends Model
{
    use Concerns\UsesUuid;

    public $timestamps = false;

    protected $fillable = [];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}