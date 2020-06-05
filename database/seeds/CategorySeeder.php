<?php

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    private $categories = [
      [
        "id" => "1d72728a-a127-11ea-bb37-0242ac130000",
        "name" => "Food",
        "children" => [
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130001",
            "name" => "Vegetables",
            "children" => [
              [ 
                "id" => "1d72728a-a127-11ea-bb37-0242ac130011",
                "name" => "Lettuce"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130021",
                "name" => "Potatoes"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130031",
                "name" => "Tomatoes"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130041",
                "name" => "Cucumbers"
              ],
            ]
          ],
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130002",
            "name" => "Fruits",
            "children" => [
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130012",
                "name" => "Apples"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130022",
                "name" => "Grapes"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130032",
                "name" => "Oranges"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130042",
                "name" => "Bananas"
              ],
            ]
          ],
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130003",
            "name" => "Dairy Foods",
            "children" => [
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130013",
                "name" => "Milk"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130023",
                "name" => "Butter"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130033",
                "name" => "Cheese"
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130043",
                "name" => "Eggs"
              ]
            ]
          ]
        ]
      ],
    ];

    public function run()
    {
      $this->traverse($this->categories);
    }

    public function traverse(Array $categories = [], $parent_id = null) {
      foreach($categories as $category) {
        $category["parent_id"] = $parent_id;
        $children = isset($category["children"]) ? $category["children"] : null;
        unset($category["children"]);
        $record = Category::create($category);
        if ($children) {
          $this->traverse($children, $record->id);
        }
      }
    }
}
