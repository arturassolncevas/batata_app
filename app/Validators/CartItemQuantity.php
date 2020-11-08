<?php

namespace App\Validators;

use GuzzleHttp\Client;
use App\Models\Product;

class CartItemQuantity
{
    public function validate(
        $attribute, 
        $value, 
        $parameters, 
        $validator
    ){
        $valid = true;
        $product = Product::find($value["product"]['id']);
        if ($product->min_quantity > $value["quantity"] || $value["quantity"] > $product->max_quantity) {
          $validator->addReplacer('cart_item_quantity', function($message, $attribute, $rule, $parameters) use($product){
            $parameters["min"] = $product->min_quantity;
            $parameters["max"] = $product->max_quantity;
            return str_replace([':min', ':max'], $parameters, $message);
          });
          return false;
        }
        return $valid;
    }
}