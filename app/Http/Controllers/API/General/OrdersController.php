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
use App\Http\Resources\OrderCollection;
use Carbon\Carbon;
use App\Http\Resources\Order as OrderResource;
use DB;

class OrdersController extends Controller
{
    private $sort_columns = ["date", "total"];
    public function filter(Request $request) {
      $user = Auth::user();
      $search_params = $request->all()["data"];  
      $order_searcher = new OrderSearcher($search_params, $user->company->orders());

      $sort_by = isset($search_params["sort_by"]) && in_array($search_params["sort_by"], $this->sort_columns) ? $search_params["sort_by"] : "date";
      $direction = isset($search_params["direction"]) ? $search_params["direction"] : "asc";
      $page = isset($search_params["page"]) ? (int)$search_params["page"] : 1;
      $size = Order::$pagination_size;
      $sorted = $order_searcher->filter()->apply_order($sort_by, $direction)->query->paginate($size, ['*'], 'page', $page);

      if (count($sorted->items()) == 0 && $page > 1) {
        $search_params["page"] = 1;
        $request->merge([ "data" => $search_params ]);
        return $this->filter($request);
      }

      return response()->json(new OrderCollection($sorted->items(),
        ["page" => $sorted->currentPage(), "size" => $sorted->perPage(), "total" => $sorted->total()],
        ["direction" => $direction, "sort_by" => $sort_by]));
    }

    public function filter_placed_orders() {
      $user = Auth::user();
      return response()->json(OrderResource::collection($user->placed_orders)); 
    }

    public function create()
    { 
      //$this->authorize('create', Product::class);
      $user = Auth::user();
      $params = [
          "status" => "pending",
          "total_discount" => 0,
          "shipping_total" => 0,
          "total" => 0,
          "discount_tax" => 0,
          "shipping_tax" => 0,
          "total_tax" => 0,
          "include_tax" => false,
          "date_paid" => Carbon::now(),
          "date_completed" => Carbon::now(),
          "currency" => $user->currency,
          "customer" => $user
        ];

      $line_items = [];
      $total = 0;
      $cart = Cart::restore($user->id);
      $content = Cart::content()->toArray();

      if (count($content) == 0)
        return response()->json([''], 200);

      foreach ($content as $key => $value) {
        $product = Product::findOrFail($value["id"]);
        $line_item_params = [
            "total" => $value["quantity"] * $product->price,
            "total_tax" => 0,
            "product_quantity" => $product->quantity,
            "quantity" => $value["quantity"],
            "name" => $product->category->name,
            "packed" => false,
            "price" => $product->price,
            "measurement_unit" => $product->measurement_unit,
            "product" => $product,
          ];

        $line_item_manager = new LineItemsManager($line_item_params, $user);
        $line_item_manager->create(["save" => false]);
        array_push($line_items, $line_item_manager->line_item);
        $total += $product->price * $value["quantity"];
      }

      $params["line_items"] = $line_items;
      $params["total"] = $total;
      $order_manager = new OrderManager($params, $user);
      $order = $order_manager->create();
      Cart::destroy($user->id);
    }
}

class OrderManager {

   function __construct($params, $user) {
    $this->params = $params;
    $this->user = $user;
    $this->order = null;
   }

  function create() {
    DB::transaction(function () {
      $this->order = new Order($this->params);
      $this->create_associations();
      $this->order->save();
      $this->create_relations();
    });
    return $this->order;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["customer", "currency", "billing_address", "delivery_address"])) {
        $this->order->{$key}()->associate($value);
      }
    }
  }

  function create_relations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["line_items"])) {
        $this->order->{$key}()->delete();
        $this->order->{$key}()->saveMany($value);
      }
    }
  }
}

class LineItemsManager {
   function __construct($params, $user) {
    $this->params = $params; 
    $this->line_item = null;
    $this->user = $user;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->line_item = new LineItem($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->line_item->save();
    });
    return $this->line_item;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["measurement_unit", "product", "order"])) {
        $this->line_item->{$key}()->associate($value);
      }
    }
  }
}

class Ordersearcher {
  
  function __construct($search_params, $builder = null) {
    $this->search_params = $search_params; 
    $this->query = $builder ? $builder : Order::all();
  }

  function filter() {
    return $this;
  }

  function apply_order($sort_by, $direction) {
    switch ($sort_by) {
      case "date":
        $sort_by = "created_at";
      default:
      $this->query->orderBy($sort_by, $direction);
      break;
    }
    return $this;
  }
}




