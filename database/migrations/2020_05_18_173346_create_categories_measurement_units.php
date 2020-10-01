<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesMeasurementUnits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_measurement_units', function (Blueprint $table) {
            $table->uuid('category_id');
            $table->uuid('measurement_unit_id');
            $table->boolean('default')->nullable();
            $table->integer('priority_order');

            $table->primary(['category_id', 'measurement_unit_id']);
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('measurement_unit_id')->references('id')->on('measurement_units');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_measurement_units');
    }
}
