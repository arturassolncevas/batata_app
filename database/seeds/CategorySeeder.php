<?php

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    private $categories = [
      [
        "id" => "1d72728a-a127-11ea-bb37-0242ac130000",
        "name" => ["en" => "Food", "da" => "Fødevarer"],
        "children" => [
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130001",
            "name" => ["en" => "Vegetables", "da" => "Grøntsager"],
            "children" => [
              [ 
                "id" => "1d72728a-a127-11ea-bb37-0242ac130011",
                "name" => ["en" => "Lettuce", "da" => "Salat"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130021",
                "name" => ["en" => "Potatoes", "da" => "Kartofler"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130031",
                "name" => ["en" => "Tomatoes", "da" => "Tomater"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130041",
                "name" => ["en" => "Cucumbers", "da" => "Agurker"]
              ],
            ]
          ],
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130002",
            "name" => ["en" => "Fruits", "da" => "Frugt"],
            "children" => [
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130012",
                "name" => ["en" => "Apples", "da" => "Æbler"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130022",
                "name" => ["en" => "Grapes", "da" => "Druer"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130032",
                "name" => ["en" => "Oranges", "da" => "Appelsiner"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130042",
                "name" => ["en" => "Bananas", "da" => "Bananer"]
              ],
            ]
          ],
          [
            "id" => "1d72728a-a127-11ea-bb37-0242ac130003",
            "name" => ["en" => "Dairy Foods", "da" => "Mejeriprodukter"],
            "children" => [
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130013",
                "name" => ["en" => "Milk", "da" => "Mælk"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130023",
                "name" => [ "en" => "Butter", "da" => "Smør"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130033",
                "name" => ["en" => "Cheese", "da" => "Ost"]
              ],
              [
                "id" => "1d72728a-a127-11ea-bb37-0242ac130043",
                "name" => ["en" => "Eggs", "da" => "Æg"]
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
