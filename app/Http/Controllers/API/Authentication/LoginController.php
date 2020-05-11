<?php

namespace App\Http\Controllers\API\Authentication;

use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User; 
use Validator;

class LoginController extends Controller
{
    public function login() { 
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) { 
            $user = Auth::user(); 
            $success['token'] =  $user->createToken('MyApp')-> accessToken; 
            return response()->json(['success' => $success], 200); 
        }
        else { 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }

    public function logout() {
      if (Auth::check()) {
          $user = Auth::user();
          return response()->json($user, 200); 
      }
      return response("", 200); 
    }

}
