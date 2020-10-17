<?php

namespace App\Http\Controllers\API\General;

use App\Http\Resources\ProductFile as ProductFileResource;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\ProductFile;
use App\Services\FileUtils;
use Illuminate\Support\Str;
use App\Models\Product;
use DB;

class ProductFilesController extends Controller
{
    public function upload_image(Request $request)
    { 
      $input = $request->all();
      $product = Product::find($input["product_id"]);
      $file = null;
       DB::transaction(function() use(&$input, &$product, &$file) {
        //Image
        $group_priority = $input['group_priority'];
        $group_id = (string) Str::uuid();
        $base64 = $input["base64"]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval((string) Str::uuid()).".".$extension;
        $data = base64_decode($base64);
        $product->save_file($data, $file_name, $extension, "image", true, $group_id, $group_priority);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);
        $file = $product->save_file($data->__toString(), $file_name, $extension, "thumbnail", true, $group_id, $group_priority);
      });
      return response()->json(new ProductFileResource($file)); 
    }

    function delete_image(Request $request) {
      $id = request()->route('id');
      $product_file = ProductFile::find($id);

       DB::transaction(function() use(&$product_file) {
        //Image
        if ($product_file->group_id)
          $images = ProductFile::where('group_id', $product_file->group_id);
        $paths = $images->get()->pluck('path')->toArray();
        $images->delete();
        Storage::disk('minio')->delete($paths);
      });
    }

}