<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CategoryMeasurementUnit extends Pivot
{
    use Concerns\UsesUuid;

    public $timestamps = false;
    public $id = false;

    protected $fillable = [];
    protected $table = 'category_measurement_units';

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}