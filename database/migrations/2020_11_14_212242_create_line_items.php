<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLineItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('line_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->decimal('product_quantity', 9, 3);
            $table->decimal('quantity', 9, 3);
            $table->decimal('total', 9, 3);
            $table->boolean('packed');
            $table->decimal('total_tax', 9, 3)->nullable();
            $table->decimal('price', 9, 3);

            $table->uuid('measurement_unit_id');
            $table->uuid('product_id');
            $table->uuid('order_id');

            $table->foreign('measurement_unit_id')->references('id')->on('measurement_units');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('order_id')->references('id')->on('orders');
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
        Schema::dropIfExists('line_items');
    }
}
