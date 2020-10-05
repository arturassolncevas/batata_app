<?php

namespace App\Http\Controllers\API\Users;

use App\Http\Resources\User as UserResource;
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User; 
use Validator;

class UsersController extends Controller
{
    
    public $successStatus = 200;
    
    public function details(Request $request)
    { 
        $user = Auth::user();
        if ($user) {
            return response()->json(new UserResource($user), $this-> successStatus); 
        } else {
            return response('', 401);
        }
	  }
}
