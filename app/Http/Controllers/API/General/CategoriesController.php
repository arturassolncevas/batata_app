<?php

namespace App\Http\Controllers\API\General;


use App\Http\Resources\CategoryCollection;
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
    public function index(Request $request)
    { 
      ;
      $user = Auth::guard('api')->check() ? Auth::guard('api')->user() : null;
      $categories = Category::with('attributes.options');
      if ($user) {
        $collation = $user->collation();
        $categories = $categories->orderByRaw("\"name\"->>'da' COLLATE \"$collation\"");
      } else {
        $categories = $categories->orderBy("name->da");
      }
      return response()->json(new CategoryCollection($categories->get()));
	  }
}
