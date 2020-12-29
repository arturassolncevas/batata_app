<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Address as AddressResource;

class CompanySettings extends JsonResource
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
          'type' => $this->type,
          'email' => $this->email,
          'local_code' => $this->local_code,
          'address' => new AddressResource($this->address),
        ];
    }
}
