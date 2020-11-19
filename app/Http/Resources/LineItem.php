<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\Product as ProductResource;
use App\Http\Resources\Currency as CurrencyResource;
use App\Http\Resources\MeasurementUnit as MeasurementUnitResource;

class LineItem extends JsonResource
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
          'id' => $this->id,
          'total' => $this->total,
          'status' => $this->status,
          'product_quantity' => $this->product_quantity,
          'quantity' => $this->quantity,
          'name' => $this->name,
          'packed' => $this->oacked,
          'price' => $this->price,
          'measurement_unit' => new MeasurementUnitResource($this->measurement_unit),
          'product' => new Product($this->product)
        ];
    }
}
