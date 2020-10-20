<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('category_id');
            $table->uuid('company_id');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->uuid('measurement_unit_id');
            $table->boolean('packed');
            $table->decimal('quantity', 8, 2);
            $table->decimal('min_quantity', 8, 2);
            $table->decimal('max_quantity', 8, 2);
            $table->decimal('quantity_in_stock', 8, 2);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('company_id')->references('id')->on('companies');
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
        Schema::dropIfExists('products');
    }
}
