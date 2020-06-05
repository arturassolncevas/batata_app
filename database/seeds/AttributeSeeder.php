<?php

use Illuminate\Database\Seeder;
use App\Models\Attribute;

class AttributeSeeder extends Seeder
{
    private $attributes = [
      [ 
        "id" => "80536412-a12d-11ea-bb37-0242ac130000",
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "name" => "Type",
        "required" => true,
        "ui_element_type" => "select_box",
        "priority_order" => 1
      ],
      [ 
        "id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "name" => "Color",
        "ui_element_type" => "select_box",
        "priority_order" => 2
      ]
    ];

    public function run()
    {
      foreach($this->attributes as $attribute) {
        Attribute::create($attribute);
      }
    }
}
