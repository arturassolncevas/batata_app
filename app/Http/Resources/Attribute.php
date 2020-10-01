<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Option;

class Attribute extends JsonResource
{
    /**
     * transform the resource into an array.
     *
     * @param  \illuminate\http\request  $request
     * @return array
     */
    public function toarray($request)
    {
        return [
          'id' => $this->id,
          'name' => $this->name,
          'required' => $this->required,
          'category_id' => $this->category_id,
          'priority_order' => $this->priority_order,
          'ui_element_type' => $this->ui_element_type,
          'options' => Option::collection($this->options)

        ];
    }
}
