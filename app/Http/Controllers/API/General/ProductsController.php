<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\ProductRequest;

class ProductsController extends Controller
{
    public function step_2(ProductRequest $request)
    { 
      $validated = $request->validated();
      return response()->json($validated); 
    }
}