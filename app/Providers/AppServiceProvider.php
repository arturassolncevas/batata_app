<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        Passport::ignoreMigrations();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
      //Validators
      Validator::extend( 'recaptcha', 'App\\Validators\\ReCaptcha@validate');
      Validator::extend( 'product_attribute', 'App\\Validators\\ProductAttribute@validate');
      Validator::extend( 'cart_item_quantity', 'App\\Validators\\CartItemQuantity@validate');
    }
}
