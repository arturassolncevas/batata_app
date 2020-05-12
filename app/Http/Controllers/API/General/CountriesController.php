<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Country;

class CountriesController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function index(Request $request)
    { 
      $countries = Country::all();
      return response()->json($countries); 
	  }
}
