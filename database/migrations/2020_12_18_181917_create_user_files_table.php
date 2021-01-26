<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->integer('group_priority')->nullable();
            $table->string('extension');
            $table->enum('type', ['file', 'image', 'thumbnail', 'document', 'profile_image']);
            $table->boolean('public');
            $table->string('path');
            $table->string('url');
            $table->uuid('group_id')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
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
        Schema::dropIfExists('user_files');
    }
}
