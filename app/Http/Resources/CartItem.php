<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Product as ProductResource;
use App\Models\Product;

class CartItem extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
          'unique_id' => $this['unique_id'],
          'product' => new ProductResource(Product::find($this["id"])),
          'quantity' => $this['quantity'] == null ? 1 : $this['quantity']
        ];
    }
}