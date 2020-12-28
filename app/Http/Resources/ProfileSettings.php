<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Currency as CurrencyResource;
use App\Http\Resources\Language as LanguageResource;

class ProfileSettings extends JsonResource
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
          'email' => $this->email,
          'company_id' => $this->company_id,
          'phone' => $this->phone,
          'currency' => new CurrencyResource($this->currency),
          'language' => new LanguageResource($this->language),
          'roles' => array_map( function($val) { return $val["name"]; }, $this->roles->toArray()),
          'profile_image' => new UserFile($this->profile_image())
        ];
    }
}
