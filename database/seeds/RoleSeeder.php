<?php

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'employee']);
        Role::create(['name' => 'driver']);
        Role::create(['name' => 'customer']);
        Role::create(['name' => 'client']);
    }
}