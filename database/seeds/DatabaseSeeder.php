<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
       $this->call(CompanySeeder::class);
       $this->call(UserSeeder::class);
       $this->call(TypeSeeder::class);
    }
}