<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Language extends JsonResource
{
    public function toArray($request)
    {
        return [
          'id' => $this->id,
          'name' => $this->name,
          'parent_id' => $this->parent_id,
          'alias' => $this->alias,
          'code' => $this->code
        ];
    }
}
