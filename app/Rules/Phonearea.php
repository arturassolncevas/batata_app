<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Country;

class Phonearea implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */

    public $phone_area_country_id;

    public function __construct($phone_area_country_id)
    {
      $this->phone_area_country_id = $phone_area_country_id;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
       return Country::find($this->phone_area_country_id); 
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
      return trans('validation.phone_area');
    }
}
