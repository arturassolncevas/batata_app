<?php

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    private $companies = [
      [
        "name" => "Seller Company 1",
        "type" => "seller"
      ],
      [
        "name" => "Seller Company 2",
        "type" => "seller"
      ],
      [
        "name" => "Buyer Company 1",
        "type" => "buyer"
      ],
      [
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
