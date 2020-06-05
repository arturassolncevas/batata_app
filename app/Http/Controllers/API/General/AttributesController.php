<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Attribute;

class AttributesController extends Controller
{
    public function index(Request $request)
    { 
      $input = $request->all();
      $attributes = [];
      if ($input['category_id'])
        $attributes = Attribute::where('category_id', $input['category_id'])->with('options')->get();
      return response()->json($attributes); 
	  }
}
