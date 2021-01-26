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
          'user.name' => 'required|max:255',
          'user.email' => 'required|email|max:255|unique:users,email',
          'user.password' => 'required|max:255',
          'user.repeat_password' => 'bail|required|same:user.password',
          'company.local_code' => 'required|max:255|unique:companies,local_code',
          'company.name' => 'required|max:255|unique:companies,name',
          'company.email' => 'required|email|max:255|unique:companies,email',
          'company.type' => 'required',
          'company.address.phone' => ['bail', new Phonearea($this->company["address"]["country"]["id"]),'required', 'max:255'],
          'company.address.country.id' => 'required',
          'company.address.address_1' => 'required|max:255',
          'company.address.zipcode' => 'required|max:255',
          'company.address.city' => 'required|max:255',
          'accept_terms_and_conditions' => 'accepted',
          // 'captcha_value' => 'recaptcha'
        ];
    }
}
