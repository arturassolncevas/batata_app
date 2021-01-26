<?php

namespace App;

//use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;
use App\Models\UserFile;
use Config;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    use Models\Concerns\UsesUuid;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'company_id', 'language_id', 'currency_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    private $file_base_path = "users";

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function language()
    {
        return $this->belongsTo('App\Models\Language');
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }

    public function currency()
    {
        return $this->belongsTo('App\Models\Currency');
    }

    public function placed_orders()
    {
        return $this->hasMany('App\Models\Order', 'customer_id');
    }

    public function files()
    {
        return $this->hasMany('App\Models\UserFile');
    }

    public function profile_image() {
      return $this->files()->where('type', 'profile_image')->first();
    }

    public function collation() {
      return Config::get('app.COLLATION_'.$this->language->alias);
    }

    public function save_file($data, $file_name, $extension, $type, $public, $group_id = null, $group_priority = 0) {
        $file_path = $this->file_base_path."/".$this->getKey()."/".$type."/".strval($file_name);
        $params = [ "extension" => $extension, "type" => $type, "url" => $file_path, "public" => $public, "path" => $file_path, "group_id" => $group_id, "group_priority" => $group_priority ];
        $file = $this->files()->save(new UserFile($params));
        Storage::disk('minio')->put($file_path, $data, $public ? "public" : "private");
        return $file;
    }

}
