<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductAttributeOption;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Auth;
use App\Services\FileUtils;
use App\Http\Resources\Product as ProductResource;
use App\Http\Resources\ProductCollection;
use Intervention\Image\Facades\Image;
use DB;

class ProductsController extends Controller
{
    public function index() {
      $products = Product::all();
      return response()->json(new ProductCollection($products));
    }

    public function step_2(ProductRequest $request)
    { 
      $validated = $request->validated();
      return response()->json($validated); 
    }

    public function step_3(ProductRequest $request)
    { 
      $validated = $request->validated();
      return response()->json($validated); 
    }

    public function create(ProductRequest $request)
    { 
      $validated = $request->validated();
      $product_manager = new ProductManager($request, Auth::user());
      $product = $product_manager->create();
      $product->load("files");
      return new ProductResource($product);
    }
}

class ProductManager {
  public static $product_attributes = [
    "title",
    "packed",
    "price",
    "quantity",
    "category_id",
    "description",
    "max_quantity",
    "min_quantity",
    "quantity_in_stock",
    "measurement_unit_id",
  ];

  public static $product_associations = [
    "product_attributes",
    "files",
  ];
  function __construct($request, $user) {
    $this->params = $request->only(self::$product_attributes); 
    $this->associations = $request->only(self::$product_associations);
    $this->user = $user;
    $this->product = null;
  }


  function create() {
    DB::transaction(function () {
      $this->params["user_id"] = $this->user->id;
      $this->product = Product::create($this->params);
      foreach ($this->associations as $name => $params) {
          switch ($name) {
            case "product_attributes":
              $this->create_attributes($params);
              break;
            case "files":
              $this->create_files($params);
              break;
          }
      }
    });
    return $this->product;
  }

  function create_attributes($attributes) {
    $container = [];
    foreach ($attributes as $values) {
      $container[] = new ProductAttributeOption([
        "attribute_id" => $values["attribute_id"],
        "option_id" =>  $values["option_id"]
      ]);
    }
    $this->product->attribute_options()->delete();
    $this->product->attribute_options()->saveMany($container);
  }

  function create_files($files) {
    for ($x = 0; $x < count($files); $x++) {
        //Image
        $base64 = $files[$x]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval($x).".".$extension;
        $data = base64_decode($base64);
        $this->product->save_file($data, $file_name, $extension, "image", true);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);
        $this->product->save_file($data->__toString(), $file_name, $extension, "thumbnail", true);
    }
  }
}
