<?php

namespace App\Http\Middleware;

use Closure;

class SetLocale
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        if ($user) {
          app()->setLocale($user->language->alias);
          //app()->setLocale("en");
        }
        return $next($request);
    }
}