<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use Concerns\UsesUuid;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'local_code',
      'name',
      'type',
      'email',
      'phone',
      'address_id'
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
    ];

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }

    public function incoming_orders()
    {
        return $this->hasMany('App\Models\Order', 'company_id');
    }

    public function address()
    {
        return $this->belongsTo('App\Models\Address', 'address_id');
    }

}
