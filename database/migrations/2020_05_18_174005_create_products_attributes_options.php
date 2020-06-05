<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsAttributesOptions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products_attributes_options', function (Blueprint $table) {
            $table->uuid('product_id');
            $table->uuid('attribute_id');
            $table->uuid('option_id');

            $table->primary(['product_id', 'attribute_id']);
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('attribute_id')->references('id')->on('attributes');
            $table->foreign('option_id')->references('id')->on('options');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products_attribute_options');
    }
}
