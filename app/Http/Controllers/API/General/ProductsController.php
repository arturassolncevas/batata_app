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
use Elasticsearch\ClientBuilder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Collection;
use DB;

class ProductsController extends Controller
{
    public function filter() {
      Gate::authorize('filter-products');
      $search_params = request("data");  
      $pagination = [
        "size" => Product::$pagination_size,
        "page" => isset($search_params["page"]) ? (int)$search_params["page"] : 1
      ];
      $sorting = [
        "sort_by" => isset($search_params["sort_by"]) ? $search_params["sort_by"] : "",
        "direction" => isset($search_params["direction"]) ? $search_params["direction"] : "asc"
      ];
      $filtered = ProductManager::filter($search_params, $pagination, $sorting);
      $products = Product::whereIn("id", $filtered["ids"] )->get();
      $sorted = $products->sortBy(function($e) use ($filtered) { return array_search($e->id, $filtered["ids"]); });
      return response()->json(new ProductCollection($sorted, $filtered["pagination"], $filtered["sorting"]));
    }



    public function find() {
      $id = request()->route('id');
      $product = Product::find($id);
      return response()->json(new ProductResource($product));
    }

    public function step_2(ProductRequest $request)
    { 
      Gate::authorize('step2-products');
      $validated = $request->validated();
      return response()->json($validated); 
    }

    public function step_3(ProductRequest $request)
    { 
      Gate::authorize('step3-products');
      $validated = $request->validated();
      return response()->json($validated); 
    }

    public function create(ProductRequest $request)
    { 
      $this->authorize('create', Product::class);
      $validated = $request->validated();
      $product_manager = new ProductManager($request, Auth::user());
      $product = $product_manager->create();
      $product->load("files");
      return new ProductResource($product);
    }

    public function update(ProductRequest $request) {
      $id = request()->route('id');
      $product = Product::findOrFail($id);
      $this->authorize('update', $product);
      $validated = $request->validated();
      $product_manager = new ProductManager($request, Auth::user());
      $product = $product_manager->update($product);
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
    "company",
    "user",
    "product_attributes",
    "files",
  ];
  function __construct($request, $user) {
    $this->params = $request->only(self::$product_attributes); 
    $this->associations = $request->only(self::$product_associations);
    $this->user = $user;
    $this->product = null;
  }

  /*
    |--------------------------------------------------------------------------
    | Product creation
    |--------------------------------------------------------------------------
    | Instance methods for product creation which includes insertings record in a database,
    | assigning associations, creating files in s3 and indexing.
    |
    */

  function create() {
    DB::transaction(function () {
      $this->product = new Product($this->params);
      $this->product->user()->associate($this->user);
      $this->product->company()->associate($this->user->company);
      $this->product->save();
      $this->create_associations();
      $this->index();
    });
    return $this->product;
  }

  function update($product) {
    DB::transaction(function () use(&$product) {
      $this->association = ["product_attributes"];
      $this->product = $product;
      $this->product->update($this->params);
      $this->create_associations();
      $this->index();
    });
    return $this->product;
  }

  function create_associations() {
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
        $group_id = (string) Str::uuid();
        $base64 = $files[$x]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval($x).".".$extension;
        $data = base64_decode($base64);
        $this->product->save_file($data, $file_name, $extension, "image", true, $group_id, $x);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);
        $this->product->save_file($data->__toString(), $file_name, $extension, "thumbnail", true, $group_id, $x);
    }
  }

  function index() {
    $data = $this->generate_index_data();
    $client = ClientBuilder::create()->build();
    $return = $client->index($data);
  }

  function generate_index_data() {
    
     $data = [
      'id' => $this->product->id,
      'index' => Product::$index_name,
      'refresh' => "wait_for",
      'body' => [ 
        'id' => $this->product->id,
        'type' => $this->product->category->name,
        'company_id' => $this->product->company->id,
        'title' => $this->product->getTranslations()["title"],
        'category_id' => $this->product->id,
        'category_chain_ids' => $this->product->category->category_chain_ids(),
        'category_chain_names' => $this->product->category->category_chain_names(),
        'price' => [ 'value' => $this->product->price, 'currency' => $this->user->currency->iso_code ],
        'measurement_unit'=>[
          'id' => $this->product->measurement_unit->id,
          'alias' => $this->product->measurement_unit->alias
        ],
        'quantity' => $this->product->quantity,
        'packed' => $this->product->packed,
        'attribute_options' => [],
        'location' => [
          'google' => [
            'long' => '',
            'lat' => ''
          ]
        ]
      ]
    ];

    foreach ($this->product->attribute_options as $element) {
      $attribute_option = [
        "attribute_id" => $element->attribute->id,
        "option_id" => $element->option->id,
        "number_value" => null,
        "text_value" => null
      ];
      array_push($data["body"]["attribute_options"], $attribute_option);
    }
    return $data;
  }

    /*
    |--------------------------------------------------------------------------
    | Product filtering
    |--------------------------------------------------------------------------
    | Classmethods for product filtering. Initially filters in
    | elasticsearh and then fetches records from SQL db.
    |
    */

    public static function filter($data, $pagination, $sorting) {
      $must = [];

      //PRICE
      if (isset($data["price_from"]) && strlen($data["price_from"]) > 0 || isset($data["price_to"]) && strlen($data["price_to"]) > 0) {
          $query = [ "range" => [ "price.value" => [] ] ];
          $from = (float)$data["price_from"];
          $to = (float)$data["price_to"];
          if ($from)
            $query["range"]["price.value"]["gte"] = $from;
          if ($to)
            $query["range"]["price.value"]["lte"] = $to;
          array_push($must, $query);
      }
      //CATEGORY
      if (isset($data["category_id"]) && is_array($data["category_id"]) && count($data["category_id"]) > 0) {
          array_push($must, [ "term" => [ "category_chain_ids" => end($data["category_id"])] ]);
      }
      //ATTRIBUTES
      if (isset($data["product_attributes"]) && is_array($data["product_attributes"]) && count($data["product_attributes"]) > 0) {
          foreach ($data["product_attributes"] as $element) {
          if (!isset($element["option_id"])) {
            continue;
          }
          $nested = [ "nested" => [
              "path" => "attribute_options",
              "query" => [
                "bool" => [
                  "must" => [
                    [
                      "term" => [
                        "attribute_options.attribute_id" => $element["attribute_id"],
                      ]
                    ],
                    [
                      "term" => [
                        "attribute_options.option_id" => $element["option_id"],
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ];
          array_push($must, $nested);
        }
      }

      $query = empty($must) ? [ "match_all" => (object)[] ] : [ "bool" => [ "must" => $must ] ];
      $request = [
        "index" => Product::$index_name,
        "_source" => ["id"],
        "body" => [ 
          "query" => $query,
          "size" => $pagination["size"],
          "from" => $pagination["size"] * ($pagination["page"] - 1),
          ]
      ];
      if (!empty($sorting["sort_by"])) {
        switch($sorting["sort_by"]) {
          case "price":
            $request["body"]["sort"] = [["price.value" => ["order" => $sorting["direction"]]]];
            break;
          default:
            $request["body"]["sort"] = "";
            break;
        } 
      }

      $client = ClientBuilder::create()->build();
      $response = $client->search($request);
      $hits = $response["hits"];

      //PAGINATION
      if (count($hits["hits"]) == 0 && $hits["total"] > 0) {
        $pagination["page"] = 1;
        $request["body"]["from"] = $pagination["size"] * ($pagination["page"] - 1);
        $response = $client->search($request);
        $hits = $response["hits"];
      }

      $result = [ 
          "ids" => array_map(function ($val) { return $val["_id"]; }, $hits["hits"]),
          "pagination" => [
            "size" => $pagination["size"],
            "page" => count($hits["hits"]) > 0 ? $pagination["page"] : 1,
            "total" => $hits["total"]["value"]
          ],
          "sorting" => [
            "sort_by" => $sorting["sort_by"],
            "direction" => $sorting["direction"]
          ]
      ];
      return $result;
    }
}