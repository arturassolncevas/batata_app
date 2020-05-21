<?php

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\User;

class UserSeeder extends Seeder
{
    private $seller_companies = [];
    private $buyer_companies = [];
    private $users = [];
    
    function __construct() {
      $this->seller_companies = Company::where("type", "seller")->get();
      $this->buyer_companies = Company::where("type", "buyer")->get();

      $this->users = [
        [
          "name" => "Peter Larsen",
          "email" => "pl@mail.com",
          "password" => bcrypt('password'),
          "company_id" => $this->seller_companies[rand(0, count($this->seller_companies) - 1)]->id
        ],
        [
          "name" => "Lisa Holm",
          "email" => "lh@mail.com",
          "password" => bcrypt('password'),
          "company_id" => $this->buyer_companies[rand(0, count($this->seller_companies) - 1)]->id
        ],
      ];
    }


    public function run()
    {
      foreach($this->users as $user) {
        User::create($user);
      }
    }
}
