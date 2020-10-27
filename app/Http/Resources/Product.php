<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProductFile as ProductFileResource;
use App\Http\Resources\Category as CategoryResource;
use App\Http\Resources\MeasurementUnit as MeasurementUnitResource;
use App\Http\Resources\ProductAttributeOption as ProductAttributeOptionResource;

class Product extends JsonResource
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
          'category_id' => $this->category_id,
          'category' => new CategoryResource($this->category),
          'attributes' => ProductAttributeOptionResource::collection($this->attribute_options),
          'description' => $this->description,
          'id' => $this->id,
          'max_quantity' => $this->max_quantity,
          'min_quantity' => $this->min_quantity,
          'measurement_unit_id' => $this->measurement_unit_id,
          'measurement_unit' => new MeasurementUnitResource($this->measurement_unit),
          'packed' => $this->packed,
          'price' => $this->price,
          'quantity' => $this->quantity,
          'quantity_in_stock' => $this->quantity_in_stock,
          'title' => $this->title,
          'user_id' => $this->title,
          'files' =>  ProductFileResource::collection($this->files()->orderBy('group_priority')->get()),
        ];
    }

    private function group_files($files = []) {
        $arr = array();
        foreach ($files as $file) {
          if (!array_key_exists($file->group_id, $arr)) {
            $arr[$file->group_id] = [];
          }
          array_push($arr[$file->group_id], $file);
        }
        return $arr;
    }

}
