<?php

use Illuminate\Database\Seeder;
use App\Models\MeasurementUnit;

class MeasurementUnitsSeeder extends Seeder
{
    private $measurement_units = [
      [ 
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130000",
        "alias" => "pcs"
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130001",
        "alias" => "g"
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130002",
        "alias" => "kg"
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130003",
        "alias" => "t"
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130004",
        "alias" => "L"
      ],
      [
        "id" => "ad8e61fc-a128-11ea-bb37-0242ac130005",
        "alias" => "ml"
      ],
    ];

    public function run()
    {
      foreach($this->measurement_units as $unit) {
        MeasurementUnit::create($unit);
      }
    }
}
