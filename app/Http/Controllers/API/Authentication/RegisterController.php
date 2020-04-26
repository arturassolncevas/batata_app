<?php

namespace App\Http\Controllers\API\Authentication;

use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User; 
use Validator;

class RegisterController extends Controller
{
    
    /* Register api 
     * 
     * @return \Illuminate\Http\Response 
     */ 
    public $successStatus = 200;
    
    public function register(Request $request)
    { 
        $validator = Validator::make($request->all(), [ 
            'name' => 'required', 
            'email' => 'required|email', 
            'password' => 'required', 
            'c_password' => 'required|same:password', 
        ]);

		if ($validator->fails()) {
			return response()->json(['error'=>$validator->errors()], 401);            
		}

		$input = $request->all(); 
		$input['password'] = bcrypt($input['password']); 
		$user = User::create($input); 
		$success['token'] =  $user->createToken('MyApp')-> accessToken; 
		$success['name'] =  $user->name;

		return response()->json(['success'=>$success], $this-> successStatus); 
	}
}
