<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use Concerns\UsesUuid;
    use HasTranslations;
    //TODO background job to remove unused products
    use SoftDeletes;

    public static $index_name = "products";
    public static $pagination_size = 10;

    protected $fillable = [
      "price",
      "title",
      "packed",
      "user_id",
      "quantity",
      "category_id",
      "description",
      "max_quantity",
      "min_quantity",
      "quantity_in_stock",
      "measurement_unit_id",
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $casts = [
      "price" => "float",
      "quantity" => "float",
      "min_quantity" => "float",
      "max_quantity" => "float",
      "quantity_in_stock" => "float"
    ];

    public $translatable = ['title'];

    private $file_base_path = "products";

    public function attribute_options()
    {
        return $this->hasMany('App\Models\ProductAttributeOption');
    }

    public function files()
    {
        return $this->hasMany('App\Models\ProductFile');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }

    public function measurement_unit()
    {
        return $this->belongsTo('App\Models\MeasurementUnit');
    }

/*     public function setFirstNameAttribute($value)
    {
        $this->attributes['title'] = [ 
          'en' =>  $this->attributes['title'],
          'da' =>  $this->attributes['title']
        ];
    } */

    public function save_file($data, $file_name, $extension, $type, $public, $group_id = null, $group_priority = 0) {
        $file_path = $this->file_base_path."/".$this->getKey()."/".$type."/".strval($file_name);
        $params = [ "extension" => $extension, "type" => $type, "url" => $file_path, "public" => $public, "path" => $file_path, "group_id" => $group_id, "group_priority" => $group_priority ];
        $file = $this->files()->save(new ProductFile($params));
        Storage::disk('minio')->put($file_path, $data, $public ? "public" : "private");
        return $file;
    }
}