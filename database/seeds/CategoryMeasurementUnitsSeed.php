<?php

use Illuminate\Database\Seeder;
use App\Models\CategoryMeasurementUnit;

class CategoryMeasurementUnitsSeeder extends Seeder
{
    private $category_measurement_units = [
      [ 
      //Lettuce - g
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130011",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130001",
        "default" => true
      ],
      [ 
      //Potatoes - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130021",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [ 
      //Tomatoes - g
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130001"
      ],
      [
      //Tomatoes - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [
      //Tomatoes - psc
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130031",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130000",
      ],
      [
      //Cucumbers - psc
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130041",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130000",
        "default" => true
      ],
      [
      // Apples - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130012",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [
      // Grapes - g
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130022",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130001",
        "default" => true
      ],
      [
      // Oranges - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130032",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [
      // Bananas - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130042",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [
      // Milk - L
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130013",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130004",
        "default" => true
      ],
      [
      // Butter - g
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130023",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130001",
        "default" => true
      ],
      [
      // Cheese - kg
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130033",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "default" => true
      ],
      [
      // Eggs - pcs
        "category_id" => "1d72728a-a127-11ea-bb37-0242ac130043",
        "measurement_unit_id" => "ad8e61fc-a128-11ea-bb37-0242ac130000",
        "default" => true
      ],

    ];

    public function run()
    {
      foreach($this->category_measurement_units as $cmu) {
        CategoryMeasurementUnit::create($cmu);
      }
    }
}
