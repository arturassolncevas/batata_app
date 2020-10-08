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
use DB;

class ProductsController extends Controller
{
    public function filter() {
      $search_params = request("data");  
      $pagination = [
        "size" => Product::$pagination_size,
        "page" => isset($search_params["page"]) ? (int)$search_params["page"] : 1
      ];

      $filtered = ProductManager::filter($search_params, $pagination);
      $products = Product::whereIn("id", $filtered["ids"] )->get();
      return response()->json(new ProductCollection($products, $filtered["pagination"]));
    }

    public function find() {
      $id = request()->route('id');
      $product = Product::find($id);
      return response()->json(new ProductResource($product));
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
      $this->params["user_id"] = $this->user->id;
      $this->product = Product::create($this->params);
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
      $this->index();
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

  function index() {
    $data = $this->generate_index_data();
    $client = ClientBuilder::create()->build();
    $return = $client->index($data);
  }

  function generate_index_data() {
     $data = [
      'id' => $this->product->id,
      'index' => Product::$index_name,
      'body' => [ 
        'id' => $this->product->id,
        'type' => $this->product->category->name,
        'company_id' => $this->product->id,
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

    public static function filter($data, $pagination) {
      $must = [];
      
      if (isset($data["category_id"]) && is_array($data["category_id"]) && count($data["category_id"]) > 0) {
         array_push($must, [ "term" => [ "category_chain_ids" => end($data["category_id"])] ]);
      }

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
          "from" => $pagination["size"] * ($pagination["page"] - 1)
          ]
      ];

      $client = ClientBuilder::create()->build();
      $response = $client->search($request);
      $hits = $response["hits"];

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
            ]
      ];
      return $result;
    }
}