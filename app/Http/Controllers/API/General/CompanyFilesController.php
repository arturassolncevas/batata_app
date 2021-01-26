<?php

namespace App\Http\Controllers\API\General;

use App\Http\Resources\CompanyFile as CompanyFileResource;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use App\Http\Controllers\Controller; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ProductFile;
use App\Services\FileUtils;
use Illuminate\Support\Str;
use App\Models\CompanyFile;
use App\Models\Company;
use Illuminate\Support\Facades\Gate;
use DB;

class CompanyFilesController extends Controller
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
        $file = $user->company->save_file($data->__toString(), $file_name, $extension, "profile_image", true);
      });
      return response()->json(new CompanyFileResource($file)); 
    }

    function delete_profile_image(Request $request) {
      $user = Auth::user();
      $id = request()->route('id');
      $company_file = CompanyFile::find($id);
      Gate::authorize('delete-image-company-files', [$company_file]);
      DB::transaction(function() use(&$company_file) {
          $company_file->delete();
          Storage::disk('minio')->delete($company_file->path);
      });
    }


    public function upload_feature_image(Request $request)
    { 
      $input = $request->all();
      $company = Company::find($input["company_id"]);
      //Gate::authorize('upload-image-product-files', [$product]);
      $file = null;
       DB::transaction(function() use(&$input, &$company, &$file) {
        //Image
        $group_priority = $input['group_priority'];
        $group_id = (string) Str::uuid();
        $base64 = $input["base64"]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval((string) Str::uuid()).".".$extension;
        $data = base64_decode($base64);
        $company->save_file($data, $file_name, $extension, "feature_image", true, $group_id, $group_priority);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);
        $file = $company->save_file($data->__toString(), $file_name, $extension, "feature_image_thumbnail", true, $group_id, $group_priority);
      });
      return response()->json(new CompanyFileResource($file)); 
    }

    function delete_feature_image(Request $request) {
      $id = request()->route('id');
      $company_file = CompanyFile::find($id);
      //Gate::authorize('delete-image-product-files', [$product_file->product]);
      DB::transaction(function() use(&$company_file) {
        if ($company_file->group_id) {
          $images = CompanyFile::where('group_id', $company_file->group_id)->whereIn('type', ['feature_image', 'feature_image_thumbnail']);
          $paths = $images->get()->pluck('path')->toArray();
          $images->delete();
          Storage::disk('minio')->delete($paths);
        }
      });
    }

}