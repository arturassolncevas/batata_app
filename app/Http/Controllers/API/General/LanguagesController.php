<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Language;
use App\Http\Resources\Language as LanguageResource;

class LanguagesController extends Controller
{
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    
    public function index(Request $request)
    { 
      $languages = Language::all();
      return response()->json(LanguageResource::collection($languages)); 
	  }
}
