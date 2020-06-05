<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
       $this->call(CompanySeeder::class);
       $this->call(UserSeeder::class);
       $this->call(CategorySeeder::class);
       $this->call(MeasurementUnitsSeeder::class);
       $this->call(CategoryMeasurementUnitsSeeder::class);
       $this->call(AttributeSeeder::class);
       $this->call(OptionSeeder::class);
    }
}