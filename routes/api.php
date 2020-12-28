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
  Route::get('signup/local-code', 'API\Signup\SignupController@local_code');
  Route::post('signup/requestor', 'API\Signup\SignupController@register_requestor');

  //GENERAL
  Route::get('countries', 'API\General\CountriesController@index');

  Route::group(['middleware' => ['auth:api', 'locales' ]], function() {
    //AUTH
    Route::get('user/details', 'API\Users\UsersController@details');
    Route::get('logout', 'API\Authentication\LoginController@logout');


    //CART
    Route::get('carts/content', 'API\General\CartsController@content');
    Route::get('carts/product/{id}', 'API\General\CartsController@product');

    Route::post('carts/add/{id}', 'API\General\CartsController@add_product');
    Route::post('carts/update', 'API\General\CartsController@update');

    Route::delete('carts/destroy_item/{id}', 'API\General\CartsController@destroy_item');

    //LANGUAGES
    Route::get('languages', 'API\General\LanguagesController@index');

    //PROFILE
    Route::get('settings/profile', 'API\General\ProfileSettingsController@get_settings');
    Route::patch('settings/profile', 'API\General\ProfileSettingsController@update');

    Route::post('user_files/upload_profile_image', 'API\General\UserFilesController@upload_profile_image');
    Route::delete('user_files/delete_profile_image/{id}', 'API\General\UserFilesController@delete_profile_image');

    //PRODUCTS
    Route::get('products/{id}', 'API\General\ProductsController@find');
    Route::get('products', 'API\General\ProductsController@index');

    Route::post('products/filter', 'API\General\ProductsController@filter');
    Route::post('products/step_2', 'API\General\ProductsController@step_2');
    Route::post('products/step_3', 'API\General\ProductsController@step_3');
    Route::post('products', 'API\General\ProductsController@create');
    Route::post('product_files/upload_image', 'API\General\ProductFilesController@upload_image');

    Route::patch('products/{id}', 'API\General\ProductsController@update');

    Route::delete('products/{id}', 'API\General\ProductsController@delete');
    Route::delete('product_files/delete_image/{id}', 'API\General\ProductFilesController@delete_image');

    //ORDERS
    Route::post('placed_orders/filter', 'API\General\PlacedOrdersController@filter');
    Route::post('orders/filter', 'API\General\OrdersController@filter');
    Route::post('orders', 'API\General\OrdersController@create');

    //GENERAL
    Route::get('categories', 'API\General\CategoriesController@index');
    Route::get('attributes', 'API\General\AttributesController@index');
    Route::get('measurements', 'API\General\MeasurementsController@index');
});