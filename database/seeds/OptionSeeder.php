<?php

use Illuminate\Database\Seeder;
use App\Models\Option;

class OptionSeeder extends Seeder
{
    private $options = [
      //TOMATOES OPTIONS
      //-------------------COLOR
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130000",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => ["en" => "Red", "da" => "Rød"],
        "default" => "true",
        "priority_order" => 0
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130001",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => ["en" => "Green", "da" => "Grøn"],
        "priority_order" => 1
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130002",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130001",
        "name" => ["en" => "Yellow", "da" => "Gul"],
        "priority_order" => 2
      ],

      //Type
      //-------------------TYPE
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130004",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130000",
        "name" => ["en" => "Ordinary", "da" => "Almindelige"],

        "default" => "true",
        "priority_order" => 0
      ],
      [
        "id" => "bd943496-a12d-11ea-bb37-0242ac130003",
        "attribute_id" => "80536412-a12d-11ea-bb37-0242ac130000",
        "name" => ["en" => "Cherry", "da" => "Cherry"],
        "priority_order" => 1
      ]
    ];

    public function run()
    {
      foreach($this->options as $option) {
        Option::create($option);
      }
    }
}
