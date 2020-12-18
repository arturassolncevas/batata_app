<?php

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Language;
use App\Models\Currency;
use App\Models\Role;
use App\User;

class UserSeeder extends Seeder
{
    private $seller_companies = [];
    private $buyer_companies = [];
    private $users = [];
    
    function __construct() {
      $this->seller_companies = Company::where("type", "seller")->get();
      $this->buyer_companies = Company::where("type", "buyer")->get();
      $this->currency_dkk = Currency::where("iso_code", "DKK")->first();
      $this->currency_eur = Currency::where("iso_code", "EUR")->first();
      $this->language_en = Language::where("code", "gb")->first();
      $this->language_da = Language::where("code", "dk")->first();

      $this->users = [
        [
          "params" => [
            "id" => "630c2218-a128-11ea-bb37-0242ac130000",
            "name" => "Peter Larsen",
            "email" => "pl@mail.com",
            "password" => bcrypt('password'),
            "company_id" => $this->seller_companies[rand(0, count($this->seller_companies) - 1)]->id,
            "currency_id" => $this->currency_dkk->id,
            "language_id" => $this->language_da->id
          ],
          "roles" => ["admin"]
        ],
        [
          "params" => [
            "id" => "630c2218-a128-11ea-bb37-0242ac130001",
            "name" => "Lisa Holm",
            "email" => "lh@mail.com",
            "password" => bcrypt('password'),
            "company_id" => $this->buyer_companies[rand(0, count($this->seller_companies) - 1)]->id,
            "currency_id" => $this->currency_dkk->id,
            "language_id" => $this->language_en->id
          ],
          "roles" => ["employee"]
        ],
      ];
    }

    public function run()
    {
      foreach($this->users as $data) {
        $user = User::create($data["params"]);
        $user->assignRole(Role::where("name", $data["roles"])->get());
      }
    }
}
