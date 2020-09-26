<?php

namespace App\Http\Controllers\API\General;

use App\Http\Resources\CategoryCollection;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
    public function index(Request $request)
    { 
      $categories = Category::with('attributes.options')->get();
      return response()->json(new CategoryCollection($categories));
	  }
}
