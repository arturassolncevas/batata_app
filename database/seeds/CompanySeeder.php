<?php

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Country;
use App\Models\Address;

class CompanySeeder extends Seeder
{

    private $companies = [ [
        "id" => "20071342-a128-11ea-bb37-0242ac130000",
        "name" => "Seller Company 1",
        "type" => "seller",
        "email" => "sc1@mail.com",
        "local_code" => "24515458412",
        "phone" => "2541511215",
        "address" => [
          "address_1" => "Address 112",
          "city" => "Odense",
          "zipcode" => "5000",
          "email" => "sc1@mail.com",
          "phone" => "2541511215",
        ]
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130001",
        "name" => "Seller Company 2",
        "type" => "seller",
        "email" => "sc2@mail.com",
        "local_code" => "25515458412",
        "phone" => "2541511215",
        "address" => [
          "address_1" => "Address 19",
          "city" => "Paris",
          "zipcode" => "Kolding",
          "email" => "sc1@mail.com",
          "phone" => "2541511215",
        ]
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130002",
        "name" => "Buyer Company 1",
        "type" => "buyer",
        "email" => "bc1@mail.com",
        "local_code" => "25515418412",
        "phone" => "2541511215",
        "address" => [
          "address_1" => "Address 17",
          "city" => "Svendborg",
          "zipcode" => "5000",
          "email" => "sc1@mail.com",
          "phone" => "2541511215",
        ]
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130003",
        "name" => "Buyer Company 2",
        "type" => "buyer",
        "email" => "bc2@mail.com",
        "local_code" => "25515418488",
        "phone" => "2541511215",
        "address" => [
          "address_1" => "Address 14",
          "city" => "Bellinge",
          "zipcode" => "5000",
          "email" => "sc1@mail.com",
          "phone" => "2541511215",
        ]
      ]
    ];

    public function run() {
      $country = Country::first();
      foreach($this->companies as $company) {
        $address = Address::create($company["address"]);
        $address->country()->associate($country);
        $address->save();
        unset($company["address"]);
        $new_company = Company::create($company);
        $new_company->address()->associate($address);
        $new_company->save();
      }
    }
}
