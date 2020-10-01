<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Option extends Model
{
    use Concerns\UsesUuid;
    use HasTranslations;

    public $timestamps = false;

    protected $fillable = [];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
    public $translatable = ['name'];

}