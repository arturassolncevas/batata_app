<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CompanyFile extends Model
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
      return ['file', 'image', 'thumbnail', 'document', 'certificate', 'profile_image'];
    }

    public static function extensions() {
      return ['png', 'jpg'];
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }

}