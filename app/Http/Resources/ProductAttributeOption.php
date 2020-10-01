<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Attribute;
use App\Http\Resources\Option;

class ProductAttributeOption extends JsonResource
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
          'attribute' => new Attribute($this->attribute),
          'option' => new Option($this->option)
        ];
    }
}