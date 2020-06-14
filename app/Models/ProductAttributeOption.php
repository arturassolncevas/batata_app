<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttributeOption extends Model
{
    use Concerns\UsesUuid;

    protected $table = 'products_attributes_options';

    protected $fillable = ["attribute_id", "option_id"];

    public $timestamps = false;

    public function attribute()
    {
        return $this->belongsTo('App\Models\Attribute');
    }

    public function option()
    {
        return $this->belongsTo('App\Models\Option');
    }

}