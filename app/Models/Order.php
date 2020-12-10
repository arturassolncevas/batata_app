<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use Concerns\UsesUuid;
    use SoftDeletes;

    public static $pagination_size = 20;

    protected $fillable = [
        "status",
        "total_discount",
        "shipping_total",
        "total",
        "discount_tax",
        "shipping_tax",
        "total_tax",
        "include_tax",
        "date_paid",
        "date_completed",
        "currency_id",
        "customer_id"
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
      "total" => "float",
      "created_at" => "datetime"
    ];

    public function customer()
    {
        return $this->belongsTo('App\User', 'customer_id');
    }

    public function currency()
    {
        return $this->belongsTo('App\Models\Currency');
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }

    public function line_items()
    {
        return $this->hasMany('App\Models\LineItem');
    }
}