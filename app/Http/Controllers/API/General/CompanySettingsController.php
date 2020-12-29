<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CompanySettings as CompanySettingsResource;
use App\Http\Requests\CompanyProfileRequest;
use App\Models\Address;
use App\Models\Country;

use App\Http\Managers\AddressManager;
use App\Http\Managers\CompanyManager;
use DB;

class CompanySettingsController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function get_settings(Request $request)
    { 
      $user = Auth::user();
      return response()->json(new CompanySettingsResource($user->company)); 
    }
    
    public function update(CompanyProfileRequest $request) {
      $user = Auth::user();
      $company_params = $request->validated()["company_profile"];
      $address_params = $company_params["address"];
      $address_params["country"] = Country::find($address_params["country"]["id"]);
      $company_params["phone"] = $address_params["phone"];
      $company = $user->company;
      $address = $company->address;

      DB::transaction(function () use ($address, $address_params, $company, $company_params) {
        $address = (new AddressManager($address_params))->update($address);
        $company_params["address"] = $address;
        $company = (new CompanyManager($company_params))->update($company);
      });

      return response()->json(new CompanySettingsResource($company)); 
    }
}
