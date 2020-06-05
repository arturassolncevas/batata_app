<?php

namespace App\Validators;

use GuzzleHttp\Client;
use App\Models\Attribute;

class ProductAttribute
{
    public function validate(
        $attribute, 
        $value, 
        $parameters, 
        $validator
    ){
        $valid = true;
        $attributes = Attribute::where('category_id', $validator->getData()['category_id'])->with('options')->get();
        foreach($attributes as $attribute) {
            if ($attribute->id === $value['attribute_id'] && $attribute->required && !$value['option_id']) {
              $valid = false;
            }
        }
        return $valid;
    }
}