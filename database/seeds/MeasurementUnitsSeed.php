<?php

use Illuminate\Database\Seeder;
use App\Models\MeasurementUnit;

class MeasurementUnitsSeeder extends Seeder
{
    private $measurement_units = [
      [ 
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130000",
        "alias" => ["en" => "units", "da" => "stk"],
        "max_decimal_points" => 0
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130001",
        "alias" => ["en" => "g", "da" => "g"],
        "max_decimal_points" => 3
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "alias" => ["en" => "kg", "da" => "kg"],
        "max_decimal_points" => 3
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130003",
        "alias" => ["en" => "ton", "da" => "ton"],
        "max_decimal_points" => 6
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130004",
        "alias" => ["en" => "L", "da" => "L"],
        "max_decimal_points" => 3 
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130005",
        "alias" => ["en" => "ml", "da" => "ml"],
        "max_decimal_points" => 3 
      ],
    ];

    public function run()
    {
      foreach($this->measurement_units as $unit) {
        MeasurementUnit::create($unit);
      }
    }
}
