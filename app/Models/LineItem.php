<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class LineItem extends Model
{
    use Concerns\UsesUuid;
    //use SoftDeletes;

    public static $pagination_size = 10;

    protected $fillable = [
            "total",
            "total_tax",
            "product_quantity",
            "quantity",
            "name",
            "packed",
            "price",
            "measurement_unit_id",
            "product_id",
            "sku"
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
    ];

    public function order()
    {
        return $this->belongsTo('App\Order');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function measurement_unit()
    {
        return $this->belongsTo('App\Models\MeasurementUnit');
    }
}