<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CompanyFile;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    use Concerns\UsesUuid;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    private $file_base_path = "companies";

    protected $fillable = [
      'local_code',
      'name',
      'type',
      'email',
      'phone',
      'address_id',
      'description',
      'facebook_url',
      'website_url',
      'instagram_url'
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

    public function files()
    {
        return $this->hasMany('App\Models\CompanyFile');
    }

    public function profile_image() {
      return $this->files()->where('type', 'profile_image')->first();
    }

    public function feature_images() {
      return $this->files()->where('type', 'feature_image')->orderBy('group_priority')->get();
    }

    public function save_file($data, $file_name, $extension, $type, $public, $group_id = null, $group_priority = 0) {
        $file_path = $this->file_base_path."/".$this->getKey()."/".$type."/".strval($file_name);
        $params = [ "extension" => $extension, "type" => $type, "url" => $file_path, "public" => $public, "path" => $file_path, "group_id" => $group_id, "group_priority" => $group_priority ];
        $file = $this->files()->save(new CompanyFile($params));
        Storage::disk('minio')->put($file_path, $data, $public ? "public" : "private");
        return $file;
    }

}
