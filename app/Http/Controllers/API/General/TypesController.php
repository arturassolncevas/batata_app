<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Type;

class TypesController extends Controller
{
    public function index(Request $request)
    { 
      $types = Type::all();
      return response()->json($types); 
	  }
}
