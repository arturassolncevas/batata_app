<?php

namespace App\Http\Controllers\API\Signup;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Country;
use App\Models\Requestor;
use App\Http\Requests\CreateRequestor;
use GuzzleHttp\Client;

class SignupController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function register_requestor(CreateRequestor $request)
    { 
      $validated = $request->validated();
      $requestor = Requestor::create($validated);
      return response()->json($requestor); 
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
