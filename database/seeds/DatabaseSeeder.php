<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
      Schema::table('oauth_clients', function (Blueprint $table) {
        $table->string('provider')->nullable();
      });
       $this->call(CompanySeeder::class);
       $this->call(UserSeeder::class);
       $this->call(CategorySeeder::class);
       $this->call(MeasurementUnitsSeeder::class);
       $this->call(CategoryMeasurementUnitsSeeder::class);
       $this->call(AttributeSeeder::class);
       $this->call(OptionSeeder::class);
       // $this->call(ProductSeeder::class);
    }
}