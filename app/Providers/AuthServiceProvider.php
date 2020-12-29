<?php

namespace App\Providers;

use App\Models\Product;
use App\Policies\ProductPolicy;
use Laravel\Passport\Passport;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
        Product::class => ProductPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        $this->registerGates();

        Passport::routes();
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
    }

    private function registerGates() {
      Gate::define('filter-products', function ($user) {
        $roles = $user->getRoleNames()->toArray();
        return in_array("admin", $roles) || in_array("customer", $roles) || in_array("employee", $roles) || in_array("client", $roles);
      });

      Gate::define('step2-products', function ($user) {
        return true;
      });

      Gate::define('step3-products', function ($user) {
        return true;
      });
      
      Gate::define('upload-image-product-files', function ($user, $product) {
        $roles = $user->getRoleNames()->toArray();
        return (in_array("admin", $roles) || in_array("customer", $roles) || in_array("employee", $roles) || in_array("client", $roles)) && $product->company->id == $user->company->id ;

      });

      Gate::define('delete-image-product-files', function ($user, $product) {
        $roles = $user->getRoleNames()->toArray();
        return (in_array("admin", $roles) || in_array("customer", $roles) || in_array("employee", $roles) || in_array("client", $roles)) && $product->company->id == $user->company->id ;

      });

      Gate::define('delete-image-user-files', function ($user, $file) {
        return $user->id == $file->user->id ? true : false;
      });
    }
}
