<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypeMeasurementUnit extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('type_measurement_unit', function (Blueprint $table) {
            $table->uuid('type_id');
            $table->uuid('measurement_unit_id');


            $table->primary(['type_id', 'measurement_unit_id']);
            $table->foreign('type_id')->references('id')->on('types');
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
        Schema::dropIfExists('type_measurement_unit');
    }
}
