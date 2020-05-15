<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Phonearea;

class CreateRequestor extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
          'name' => 'required|max:255',
          'company_name' => 'max:255',
          'email' => 'required|email|max:255|unique:requestors,email',
          'country_id' => 'required',
          'phone' => ['bail', new Phonearea($this->phone_area_country_id),'required', 'max:255'],
          'accept_terms_and_conditions' => 'accepted',
          'phone_area_country_id' => ''
        ];
    }
}
