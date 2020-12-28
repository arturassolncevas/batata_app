<?php

namespace App\Http\Controllers\API\Signup;

use App\Http\Requests\CreateRequestor;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Requestor;
use App\Models\Country;
use App\Models\Language;
use App\Models\Currency;
use App\Models\Company;
use App\Models\Address;
use GuzzleHttp\Client;
use App\User;
use App\Http\Manager\UserManager;
use DB;

class SignupController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function register_requestor(CreateRequestor $request)
    { 
        $request_data = $request->all();

        $address = $request_data["company"]["address"];
        $address["country"] = Country::find($address["country"]["id"]);
        $address["email"] = $request_data["user"]["email"];

        $company = $request_data["company"];
        $company["phone"] = $address["phone"];

        $user = $request_data["user"];
		    $user['password'] = bcrypt($user['password']); 
        $user["language"] = Language::where('alias', 'da')->first();
        $user["currency"] = Currency::where('alias', 'kr')->first();

      DB::transaction(function () use ($address, $company, $user) {
        $address = (new AddressManager($address))->create();
        $company["address"] = $address;
        $company = (new CompanyManager($company))->create();
        $user["company"] = $company;
        $user = (new UserManager($user))->create();
        $user->assignRole(Role::where("name", ['client'])->get());
      });

      return response()->json([ "user" => $user, "address" => $address, "company" => $company ]); 
    }
    
    public function local_code()
    { 
      $code_found = false;
      $client = new Client();
      $local_code = request("value");  
      $response = [ "errors" => [ "company" => [ "local_code" => "Not found" ] ] ];

      try {
        $api_resp = $client->get("https://cvrapi.dk/api?country=dk&search=$local_code");
        $api_data = json_decode((string)$api_resp->getBody());
        $country = Country::where("code", "dk")->first();
        $response = [
          "company" => [
            "name" => $api_data->name,
            "local_code" => $api_data->vat,
            "address" => [
              "address_1" => $api_data->address,
              "zipcode" => $api_data->zipcode,
              "city" => $api_data->city,
              "phone" => $api_data->phone,
              "email" => $api_data->email,
              "zipcode" => $api_data->zipcode,
              "country"=> [ "id" => $country->id ]
            ]
          ]
        ];
        return response()->json($response); 
      } catch(\Exception $e) {
        return response()->json($response, 422);
      }
	  }
}

class CompanyManager {
   function __construct($params) {
    $this->params = $params; 
    $this->company = null;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->company = new Company($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->company->save();
    });
    return $this->company;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["address"])) {
        $this->company->{$key}()->associate($value);
      }
    }
  }
}

class AddressManager {
   function __construct($params) {
    $this->params = $params; 
    $this->address = null;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->address = new Address($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->address->save();
    });
    return $this->address;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["country"])) {
        $this->address->{$key}()->associate($value);
      }
    }
  }
}