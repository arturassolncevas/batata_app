<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ref_code')->nullable();
            $table->enum('status', ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed', 'trash']);
            $table->decimal('total_discount', 9, 3)->nullable();
            $table->decimal('shipping_total', 9, 3)->nullable();
            $table->decimal('total', 9, 3);

            $table->decimal('discount_tax', 9, 3)->nullable();
            $table->decimal('shipping_tax', 9, 3)->nullable();
            $table->decimal('total_tax', 9, 3)->nullable();
            $table->boolean('include_tax');

            $table->string('customer_ip')->nullable();
            $table->text('customer_note')->nullable();
            $table->string('transaction_id')->nullable();
            $table->datetime('date_paid')->nullable();
            $table->datetime('date_completed')->nullabdle();
            $table->json('metadata')->nullable();

            $table->uuid('currency_id');
            $table->uuid('customer_id');
            $table->uuid('billing_address_id')->nullable();
            $table->uuid('delivery_address_id')->nullable();
            $table->uuid('payment_method_id')->nullable();

            $table->foreign('currency_id')->references('id')->on('currencies');
            $table->foreign('customer_id')->references('id')->on('users');
            $table->foreign('billing_address_id')->references('id')->on('addresses');
            $table->foreign('delivery_address_id')->references('id')->on('addresses');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
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
        Schema::dropIfExists('orders');
    }
}
