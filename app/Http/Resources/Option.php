<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Option extends JsonResource
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
          'attribute_id' => $this->attribute_id,
          'default' => $this->default,
          'priority_order' => $this->priority_order
        ];
    }
}
