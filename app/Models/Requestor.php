<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requestor extends Model
{
    use Concerns\UsesUuid;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'company_name', 'email', 'country_id', 'phone_area_country_id', 'phone', 'accept_terms_and_conditions'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
      'created_at', 'updated_at'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
