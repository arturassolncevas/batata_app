<?php

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    private $currencies = [
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130000",
        "name" => ["en" => "Danish Krone", "da" => "Danske kroner"],
        "iso_code" => "DKK",
        "alias" => "kr",
        "symbol" => "kr",
        "format_options" => [ "symbol" => "kr", "separator" => ".", "decimal" => ",", "pattern" => "# !" ]
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130001",
        "name" => ["en" => "Euro", "da" => "Euro"],
        "iso_code" => "EUR",
        "alias" => "Eur",
        "symbol" => "€",
        "format_options" => [ "symbol" => "€", "separator" => ".", "decimal" => ",", "pattern" => "# !" ]
      ]
    ];

    public function run()
    {
      foreach($this->currencies as $currency) {
        $currency["format_options"] = json_encode($currency["format_options"]);
        Currency::create($currency);
      }
    }
}
