<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Attribute extends Model
{
    use Concerns\UsesUuid;
    use HasTranslations;

    public $timestamps=false;

    protected $fillable = [
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public $translatable = ['name'];

    public function options()
    {
        return $this->hasMany('App\Models\Option');
    }
}