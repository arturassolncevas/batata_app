<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id');
            $table->integer('group_priority')->nullable();
            $table->string('extension');
            $table->enum('type', ['file', 'image', 'thumbnail', 'document', 'certificate', 'profile_image']);
            $table->boolean('public');
            $table->string('path');
            $table->string('url');
            $table->uuid('group_id')->nullable();
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies');
            $table->index('group_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('company_files');
    }
}
