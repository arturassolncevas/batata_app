<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\ProductFile;
use App\Http\Resources\ProductFile as ProductFileResource;

class ProductFilesController extends Controller
{
    public function upload_image(Request $request)
    { 
      $input = $request->all();
      return response()->json(["ok" => 200]); 

/*       DB::transaction(function () {
        $file = ProductFile::create($this->params);

        //Image
        $group_id = (string) Str::uuid();
        $base64 = $files[$x]["base64"];
        $extension = FileUtils::get_base64_extension($base64); 
        $base64 = FileUtils::strip_base64_extension($base64); 
        $file_name = strval($x).".".$extension;
        $data = base64_decode($base64);
        $this->product->save_file($data, $file_name, $extension, "image", true, $group_id);

        //Thumbnail
        $data = Image::make($data)->resize(250, 250)->encode($extension);

        $this->product->save_file($data->__toString(), $file_name, $extension, "thumbnail", true, $group_id);
        return response()->json(new ProductFileResource($file)); 
      }); */
    }

}