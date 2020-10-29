<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response('Test API', 200)
                  ->header('Content-Type', 'application/json');
});*/


  //AUTH
  Route::post('login', 'API\Authentication\LoginController@login');
  Route::post('register', 'API\Authentication\RegisterController@register');

  //SIGNUP
  Route::post('signup/requestor', 'API\Signup\SignupController@register_requestor');

  //GENERAL
  Route::get('countries', 'API\General\CountriesController@index');

Route::group(['middleware' => ['auth:api', 'locales' ]], function() {
  //AUTH
  Route::get('user/details', 'API\Users\UsersController@details');
  Route::get('logout', 'API\Authentication\LoginController@logout');
  //PRODUCTS
  Route::post('products/filter', 'API\General\ProductsController@filter');
  Route::post('products/step_2', 'API\General\ProductsController@step_2');
  Route::post('products/step_3', 'API\General\ProductsController@step_3');
  Route::post('products', 'API\General\ProductsController@create');
  Route::post('products/{id}/add_to_cart', 'API\General\ProductsController@add_to_cart');
  Route::post('product_files/upload_image', 'API\General\ProductFilesController@upload_image');

  Route::patch('products/{id}', 'API\General\ProductsController@update');

  Route::delete('products/{id}', 'API\General\ProductsController@delete');
  Route::delete('product_files/delete_image/{id}', 'API\General\ProductFilesController@delete_image');

  Route::get('products/get_cart_content', 'API\General\ProductsController@get_cart_content');
  Route::get('products/{id}', 'API\General\ProductsController@find');
  Route::get('products', 'API\General\ProductsController@index');

  //GENERAL
  Route::get('categories', 'API\General\CategoriesController@index');
  Route::get('attributes', 'API\General\AttributesController@index');
  Route::get('measurements', 'API\General\MeasurementsController@index');
});