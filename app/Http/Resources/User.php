<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Currency as CurrencyResource;
use App\Http\Resources\Language as LanguageResource;

class User extends JsonResource
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
          'currency' => new CurrencyResource($this->currency),
          'language' => new LanguageResource($this->language),
        ];
    }
}
