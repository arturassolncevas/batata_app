<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use Concerns\UsesUuid;
    protected $fillable = [
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    public function chidren()
    {
        return $this->hasMany('App\Models\Category', 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo('App\Models\Category', 'parent_id', 'id');
    }

    public function measurement_units()
    {
        return $this->belongsToMany('App\Models\MeasurementUnit', 'category_measurement_units')->using('App\Models\CategoryMeasurementUnit');
    }

    public function attributes()
    {
        return $this->hasMany('App\Models\Attribute');
    }

}
