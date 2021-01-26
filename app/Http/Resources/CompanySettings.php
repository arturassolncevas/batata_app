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
          'website_url' => $this->website_url,
          'facebook_url' => $this->facebook_url,
          'description' => $this->description,
          'address' => new AddressResource($this->address),
          'profile_image' => new CompanyFile($this->profile_image())
        ];
    }
}
