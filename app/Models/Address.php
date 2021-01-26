<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{

    protected $fillable = [
      "first_name",
      "last_name",
      "state",
      "area_code",
      "phone",
      "email",
      "address_1",
      "address_2",
      "zipcode",
      "city",
      "country_id"
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }
}
