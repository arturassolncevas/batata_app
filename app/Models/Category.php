<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use Concerns\UsesUuid;
    use HasTranslations;

    protected $fillable = [
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public $translatable = ['name'];
    
    public function children()
    {
        return $this->hasMany('App\Models\Category', 'parent_id', 'id');
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

    public function category_chain_ids() {        
      $result = []; 
      if ($this->parent) {
         $result = $this->parent->category_chain_ids();
      }
      array_push($result, $this->id);
      return $result;
    }

    public function category_chain_names() {        
      $result = []; 
      $translations = $this->getTranslations();
      if ($this->parent) {
        $result = $this->parent->category_chain_names();
      }
      if ($translations["name"] ) {
        foreach ($translations["name"] as $locale => $name) {
          if (!isset($result[$locale]))
            $result[$locale] = [];
          array_push($result[$locale], $name);
        }
      }
      return $result;
    }

}
