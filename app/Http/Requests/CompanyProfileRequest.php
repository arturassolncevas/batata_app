<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Phonearea;
use App\Models\Country;
use Illuminate\Support\Facades\Auth;

class CompanyProfileRequest extends FormRequest
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
        $phone_area_country = Country::find($this->company_profile["address"]["country"]["id"]);
        $country_id = $phone_area_country ? $phone_area_country->id : null;
        $company_id = Auth::user()->company->id;

        return [
          'company_profile.name' => "required|max:255",
          'company_profile.address.email' => "required|email|max:255|unique:companies,email,$company_id,id",
          'company_profile.address.phone' => ['bail', new Phonearea($country_id),'required', 'max:255'],
          'company_profile.address.country.id' => "required"
        ];
    }
}
