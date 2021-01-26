<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Phonearea;
use App\Models\Country;
use Illuminate\Support\Facades\Auth;

class ProfileRequest extends FormRequest
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
        $phone_area_country = Country::where('area_code', $this->profile["area_code"])->first();
        $country_id = $phone_area_country ? $phone_area_country->id : null;
        $user_id = Auth::user()->id;

        return [
          'profile.name' => 'required|max:255',
          'profile.email' => "required|email|max:255|unique:users,email,$user_id,id",
          'profile.area_code' => 'required|max:5',
          'profile.phone' => ['bail', new Phonearea($country_id),'required', 'max:255'],
          'profile.language.id' => 'required'
        ];
    }
}
