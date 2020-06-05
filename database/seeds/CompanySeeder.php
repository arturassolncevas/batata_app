<?php

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    private $companies = [
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130000",
        "name" => "Seller Company 1",
        "type" => "seller"
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130001",
        "name" => "Seller Company 2",
        "type" => "seller"
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130002",
        "name" => "Buyer Company 1",
        "type" => "buyer"
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130003",
        "name" => "Buyer Company 2",
        "type" => "buyer"
      ]
    ];

    public function run()
    {
      foreach($this->companies as $company) {
        Company::create($company);
      }
    }
}
