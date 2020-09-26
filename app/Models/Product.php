<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Product extends Model
{
    use Concerns\UsesUuid;
    use HasTranslations;

    public static $index_name = "products";

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

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }

    public function measurement_unit()
    {
        return $this->belongsTo('App\Models\MeasurementUnit');
    }

    public function setFirstNameAttribute($value)
    {
        $this->attributes['title'] = [ 'en' =>  $this->attributes['title'], 'da' =>  $this->attributes['title'] ];
    }

    public function save_file($data, $file_name, $extension, $type, $public) {
        $file_path = $this->file_base_path."/".$this->getKey()."/".$type."/".strval($file_name);
        $params = [ "extension" => $extension, "type" => $type, "url" => $file_path, "public" => $public, "path" => $file_path ];
        $this->files()->save(new ProductFile($params));
        $file = Storage::disk('minio')->put($file_path, $data, $public ? "public" : "private");
    }
}