<?php

use Illuminate\Database\Seeder;
use App\Models\Type;

class TypeSeeder extends Seeder
{
    private $types = [
      [
        "name" => "Food",
        "children" => [
          [
            "name" => "Vegetables",
            "children" => [
              [ "name" => "Lettuce" ],
              [ "name" => "Poratoes" ],
              [ "name" => "Tomatoes" ],
              [ "name" => "Cucumbers" ],
            ]
          ],
          [
            "name" => "Fruits",
            "children" => [
              [ "name" => "Apples" ],
              [ "name" => "Grapes" ],
              [ "name" => "Oranges" ],
              [ "name" => "Bananas" ],
            ]
          ],
          [
            "name" => "Dairy Foods",
            "children" => [
              [ "name" => "Milk" ],
              [ "name" => "Butter" ],
              [ "name" => "Cheese" ],
              [ "name" => "Eggs" ]
            ]
          ]
        ]
      ],
    ];

    public function run()
    {
      $this->traverse($this->types);
    }

    public function traverse(Array $types = [], $parent_id = null) {
      foreach($types as $type) {
        $type["parent_id"] = $parent_id;
        $children = isset($type["children"]) ? $type["children"] : null;
        unset($type["children"]);
        $record = Type::create($type);
        if ($children) {
          $this->traverse($children, $record->id);
        }
      }
    }
}
