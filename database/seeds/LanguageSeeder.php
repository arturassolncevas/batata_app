<?php

use Illuminate\Database\Seeder;
use App\Models\Language;

class LanguageSeeder extends Seeder
{
    private $currencies = [
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130000",
        "name" => ["en" => "English", "da" => "Engelsk"],
        "alias" => "en",
        "code" => "gb",
      ],
      [
        "id" => "20071342-a128-11ea-bb37-0242ac130002",
        "name" => ["en" => "Danish", "da" => "Dansk"],
        "alias" => "da",
        "code" => "dk",
      ]
    ];

    public function run()
    {
      foreach($this->currencies as $currency) {
        Language::create($currency);
      }
    }
}
