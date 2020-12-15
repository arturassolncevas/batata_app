<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\User;
use App\Http\Resources\Profile as ProfileResource;

class ProfileController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function settings(Request $request)
    { 
      $user = Auth::user(); 
      return response()->json(new ProfileResource($user)); 
	  }
}
