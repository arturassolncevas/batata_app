<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserFile extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
          "id" => $this->id,
          "type" => $this->type,
          "url" => $this->url,
          "group_id" => $this->group_id,
          "group_priority" => $this->group_priority
        ];
    }
}
