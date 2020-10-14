<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductFile extends Model
{
    use Concerns\UsesUuid;

    protected $fillable = [
            'extension',
            'type',
            'path',
            'url',
            'public',
            "group_id"
    ];

    public function getUrlAttribute($value)
    {
        return Storage::disk('minio')->url($value);
    }

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public static function types() {
      return ['file', 'image', 'thumbnail'];
    }

    public static function extensions() {
      return ['png', 'jpg'];
    }

}