<?php

namespace App\Http\Controllers\API\Authentication;

use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User; 
use Validator;

class LoginController extends Controller
{
    
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */
    public $successStatus = 200;
    
    public function login() { 

        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) { 
            $user = Auth::user(); 
            $success['token'] =  $user->createToken('MyApp')-> accessToken; 
            return response()->json(['success' => $success], $this-> successStatus); 
        }
        else { 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }

}