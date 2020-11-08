<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\CartItem;

class Cart extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    public function toArray($request)
    {
      return $this->convert_to_array();
    }

    public function convert_to_array() {
      $res = [];
      foreach ($this->collection->toArray() as $key => $value) {
        array_push($res, new CartItem($value));
      }
      return $res;
    }
}
