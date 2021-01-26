<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserFile extends Model
{
    use Concerns\UsesUuid;

    protected $fillable = [
            'extension',
            'type',
            'path',
            'url',
            'public',
            "group_id",
            "group_priority"
    ];

    public function getUrlAttribute($value)
    {
        return Storage::disk('minio')->url($value);
    }

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public static function types() {
      return ['file', 'image', 'thumbnail', 'document', 'profile_image'];
    }

    public static function extensions() {
      return ['png', 'jpg'];
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

}