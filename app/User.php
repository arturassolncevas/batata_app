<?php

namespace App;

//use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
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
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

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

    public function collation() {
      return Config::get('app.COLLATION_'.$this->language->alias);
    }

}
