<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requestors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('company_name')->nullable(true);
            $table->string('email');
            $table->string('country_id');
            $table->string('phone_area_country_id'); //is country id
            $table->string('phone');
            $table->string('accept_terms_and_conditions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('requestors');
    }
}
