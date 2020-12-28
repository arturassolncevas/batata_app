<?php

namespace App\Http\Controllers\API\General;

use App\Http\Resources\UserFile as UserFileResource;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ProductFile;
use App\Services\FileUtils;
use Illuminate\Support\Str;
use App\Models\UserFile;
use Illuminate\Support\Facades\Gate;
use DB;

class UserFilesController extends Controller
{
    public function upload_profile_image(Request $request)
    { 
      $user = Auth::user();
      $input = $request->all();
      $file = null;

       DB::transaction(function() use(&$input, &$user, &$file) {
        $base64 = $input["base64"]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval((string) Str::uuid()).".".$extension;
        $data = base64_decode($base64);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);
        $file = $user->save_file($data->__toString(), $file_name, $extension, "profile_image", true);
      });
      return response()->json(new UserFileResource($file)); 
    }

    function delete_profile_image(Request $request) {
      $user = Auth::user();
      $id = request()->route('id');
      $user_file = UserFile::find($id);
      Gate::authorize('delete-image-user-files', [$user_file]);
      DB::transaction(function() use(&$user_file) {
          $user_file->delete();
          Storage::disk('minio')->delete($user_file->path);
      });
    }

}