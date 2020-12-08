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
use App\Http\Resources\Order as OrderResource;
use DB;

class OrdersController extends Controller
{
    public function incomming_orders() {
      $user = Auth::user();
      return response()->json(OrderResource::collection($user->incoming_orders)); 
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




