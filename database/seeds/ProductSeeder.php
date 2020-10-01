<?php

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    private $product_options = [
      [
        "id" => "bd943496-kk2d-11ea-bb37-0242ac111111",
        "title" => [ "en" =>  "Fresh tomatoes", "dk" => "Friske tomater"],
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "description" => "Juicy and fresh tomatoes",
        "max_quantity" => 200,
        "min_quantity" => 10,
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "packed" => false,
        "price" => 10,
        "quantity" => 1,
        "quantity_in_stock" => 300,
        ""


      ],
    ];

    public function run()
    {
      foreach($this->options as $option) {
        Product::create($option);
      }
    }
}
