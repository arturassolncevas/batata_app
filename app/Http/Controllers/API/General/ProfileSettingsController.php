<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProfileSettings as ProfileSettingsResource;
use App\Http\Requests\ProfileRequest;
use App\Models\Language;
use App\Http\Requests\CreateRequestor;
use App\Http\Managers\UserManager;
use DB;

class ProfileSettingsController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function get_settings(Request $request)
    { 
      $user = Auth::user();
      return response()->json(new ProfileSettingsResource($user)); 
    }
    
    public function update(ProfileRequest $request) {
      $user = Auth::user();
      $user_params = $request->validated()["profile"];
      $user_params["language"] = Language::find($user_params["language"]["id"]);
      $user = (new UserManager($user_params))->update($user);
      return response()->json(new ProfileSettingsResource($user)); 
    }
}
