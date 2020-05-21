<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type extends Model
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
    
    public function subTypes()
    {
        return $this->hasMany('App\Models\Type', 'parent_id');
    }

    public function type()
    {
        return $this->belongsTo('App\Models\Type', 'parent_id', 'id');
    }
}
