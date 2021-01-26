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

    private function validation_steps($data_type, $params = []) { 
      switch($data_type) {
        case "secondary":
          return [
          'company_profile.description' => "required",
          'company_profile.website_url' => "required|max:25",
          'company_profile.facebook_url' => "required|max:255"
          ];
        break;
        case "primary":
        return [
          'company_profile.type' => "required",
          'company_profile.local_code' => "required|max:25",
          'company_profile.name' => "required|max:255",
          'company_profile.address.email' => "required|email|max:255|unique:companies,email,$params[company_id],id",
          'company_profile.address.phone' => ['bail', new Phonearea($params["country_id"]),'required', 'max:255'],
          'company_profile.address.country.id' => "required",
          'company_profile.address.address_1' => "required|max:255",
          'company_profile.address.zipcode' => "required|max:50",
          'company_profile.address.city' => "required|max:255"
        ];
      }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $method = explode('@', $this->route()->getActionName())[1];
        return $this->get_rules_arr($method);
    }


    public function get_rules_arr($method) {
      $result = [];
      $company_id = Auth::user()->company->id;
      switch ($method) {
          case "update_secondary":
              $result = $this->validation_steps('secondary');
              break;
          case "update_primary":
              $phone_area_country = Country::find($this->company_profile["address"]["country"]["id"]);
              $params = [
                "country_id" => $phone_area_country ? $phone_area_country->id : null,
                "company_id" => $company_id
              ];
              $result = $this->validation_steps('primary', $params);
              break;
      }
      return $result;
  }
}
