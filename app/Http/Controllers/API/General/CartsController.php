<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductAttributeOption;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\CartRequest;
use Illuminate\Support\Facades\Auth;
use App\Services\FileUtils;
use App\Http\Resources\Product as ProductResource;
use App\Http\Resources\ProductCollection;
use Intervention\Image\Facades\Image;
use Elasticsearch\ClientBuilder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Collection;
use Melihovv\ShoppingCart\Facades\ShoppingCart as Cart;
use App\Http\Resources\Cart as CartCollection;
use App\Http\Resources\CartItem as CartItemResource;
use Debugbar;
use DB;

class CartsController extends Controller
{
    public function add_product(CartRequest $request) {
      $data = request('cart_item');
      $product = Product::findOrFail($data["product"]["id"]);
      $cart = Cart::restore(Auth::user()->id);
      $content = Cart::content()->toArray();
      $cart_item_found = false; 

      foreach ($content as $key => $value) {
        if ($value["id"] == $data["product"]["id"]) {
          $quantity = $value["quantity"];
          Cart::setQuantity($key, $data["quantity"]);
          $cart_item_found = true;
          break;
        }
      }
      if (!$cart_item_found)
        Cart::add($product->id, $product->category->name, $product->price, $data["quantity"]);
      Cart::store(Auth::user()->id);
      return response()->json(new CartCollection(Cart::content()));
    }

    public function content() {
      $cart = Cart::restore(Auth::user()->id);
      return response()->json(new CartCollection(Cart::content()));
    }

    public function product() {
      $id = request()->route('id');
      $cart = Cart::restore(Auth::user()->id);
      $content = Cart::content()->toArray();
      $quantity = 0;
      foreach ($content as $key => $value) {
        if ($value["id"] == $id) {
          $quantity = $value["quantity"];
          break;
        }
      }
      $product = Product::find($id);
      return response()->json([
        "product" => new ProductResource($product),
        "quantity" => $quantity
        ]);
    }

    public function update(CartRequest $request) {
      $data = request()->all()["cart"];
      Cart::restore(Auth::user()->id);
      foreach ($data as $element) {
        Cart::setQuantity($element['unique_id'], $element["quantity"]);
      }
      Cart::store(Auth::user()->id);
      return response()->json(new CartCollection(Cart::content()));
    }

    public function destroy_item(CartRequest $request) {
      $unique_id = request()->route('id');
      Cart::restore(Auth::user()->id);
      Cart::remove($unique_id);
      Cart::store(Auth::user()->id);
      return response()->json(["deleted" =>  true, "unique_id" => $unique_id]);
    }
}