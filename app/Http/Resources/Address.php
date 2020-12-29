<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Country as CountryResource;

class Address extends JsonResource
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
          'first_name' => $this->frst_name,
          'last_name' => $this->last_name,
          'email' => $this->email,
          'company' => $this->company,
          'address_1' => $this->address_1,
          'address_2' => $this->address_2,
          'city' => $this->city,
          'state' => $this->state,  
          'zipcode' => $this->zipcode,  
          'email' => $this->email,
          'phone' => $this->phone,
          'country' => new CountryResource($this->country),
        ];
    }
}
