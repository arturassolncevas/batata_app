<?php

use Illuminate\Database\Seeder;
use App\Models\Option;

class OptionSeeder extends Seeder
{
    private $options = [
      //COLORS
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130000",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => "Red",
        "default" => "true"
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130001",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => "Green"
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130002",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => "Yellow"
      ],

      //TOMATOE OPTIONS
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130003",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130000",
        "name" => "Cherry"
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130004",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130000",
        "name" => "Ordinary",
        "default" => "true"
      ]
    ];

    public function run()
    {
      foreach($this->options as $option) {
        Option::create($option);
      }
    }
}
