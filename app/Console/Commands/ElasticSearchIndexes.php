<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Elasticsearch;
use App\Models\Product;
use Elasticsearch\ClientBuilder;

class ElasticSearchIndexes extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'elasticsearch:create_indexes';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Elasticsearch: create indexes';

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }

  /**
   * Execute the console command.
   *
   * @return int
   */
  public function handle()
  {
    $client = ClientBuilder::create()->build();
    // $client->indices()->delete([ "index" => Product::$index_name]);
    foreach ($this->indexes() as $params) {
      $pars = $params;
      $client->indices()->create($params);
    }
  }

  private function indexes()
  {
    return [$this->products_index_params()];
  }

  private function products_index_params()
  {
    return [
      "index" => Product::$index_name,
      "body" => [
        "mappings" => [
          "properties" => [
            "type" =>  ["type" => "keyword"],
            "id" => ["type" => "keyword"],
            "title" => [
              "properties" => [
                "en" => ["type" => "text"],
                "da" => ["type" => "text"]
              ]
            ],
            "category_id" => ["type" => "keyword"],
            "company_id" => ["type" => "keyword"],
            "category_chain_ids" => [
              "type" => "keyword"
            ],
            "category_chain_names" => [
              "properties" => [
                "en" => ["type" => "text"],
                "da" => ["type" => "text"]
              ]
            ],
            "price" => [
              "properties" => [
                "currency" => ["type" => "keyword"],
                "value" => ["type" => "double"]
              ]
            ],
            "measurement_unit" => [
              "properties" => [
                "id" => ["type" => "keyword"],
                "name" => ["type" => "keyword"]
              ]
            ],
            "quantity" => ["type" => "double"],
            "packed" => ["type" => "boolean"],
            "attribute_options" => [
              "type" => "nested",
              "properties" => [
                "attribute_id" => ["type" => "keyword"],
                "option_id" => ["type" => "keyword"],
                "text_value" => ["type" => "text"],
                "number_value" => ["type" => "double"]
              ]
            ]
          ]
        ]
      ]
    ];
  }
}
