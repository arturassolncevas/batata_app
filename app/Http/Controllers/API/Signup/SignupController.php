<?php

namespace App\Http\Controllers\API\Signup;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Country;
use App\Models\Requestor;
use App\Http\Requests\CreateRequestor;

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
}
