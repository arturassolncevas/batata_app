<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\LineItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Melihovv\ShoppingCart\Facades\ShoppingCart as Cart;
use Carbon\Carbon;
use App\Http\Resources\OrderCollection;
use DB;

class PlacedOrdersController extends Controller
{
    public function filter(Request $request) {
      $user = Auth::user();
      $search_params = $request->all()["data"];  
      $placed_order_manager = new PlacedOrderManager($search_params, $user->placed_orders());

      $sort_by = isset($search_params["sort_by"]) ? $search_params["sort_by"] : "total";
      $direction = isset($search_params["direction"]) ? $search_params["direction"] : "asc";
      $page = isset($search_params["page"]) ? (int)$search_params["page"] : 1;
      $size = Order::$pagination_size;
      $sorted = $placed_order_manager->filter()->apply_order($sort_by, $direction)->query->paginate($size, ['*'], 'page', $page);

      if (count($sorted->items()) == 0 && $page > 1) {
        $search_params["page"] = 1;
        $request->merge([ "data" => $search_params ]);
        return $this->filter($request);
      }

      return response()->json(new OrderCollection($sorted->items(),
        ["page" => $sorted->currentPage(), "size" => $sorted->perPage(), "total" => $sorted->total()],
        ["direction" => $direction, "sort_by" => $sort_by]));
    }
}

class PlacedOrderManager {

  public static $order_attributes = [
    "total",
  ];

  function __construct($search_params, $builder = null) {
    $this->search_params = $search_params; 
    $this->query = $builder ? $builder : Order::all();
  }

  function filter() {
    return $this;
  }

  function apply_order($sort_by, $direction) {
    $this->query->orderBy($sort_by, $direction);
    return $this;
  }

}