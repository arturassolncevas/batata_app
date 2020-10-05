<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Currency extends JsonResource
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
          'name' => $this->name,
          'parent_id' => $this->parent_id,
          'iso_code' => $this->iso_code,
          'alias' => $this->alias,
          'symbol' => $this->symbol,
          'format_options' => json_decode($this->format_options)
        ];
    }
}
