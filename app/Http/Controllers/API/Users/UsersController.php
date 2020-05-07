<?php

namespace App\Http\Controllers\API\Users;

use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User; 
use Validator;

class UsersController extends Controller
{
    
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public $successStatus = 200;
    
    public function details(Request $request)
    { 
        $user = Auth::user();
        if ($user) {
            return response()->json($user, $this-> successStatus); 
        } else {
            return response('', 401);
        }
	}
}
