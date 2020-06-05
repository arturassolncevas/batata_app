<?php

namespace App\Http\Controllers\API\General;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use App\Models\MeasurementUnit;

class MeasurementsController extends Controller
{
    public function index(Request $request)
    { 
      $input = $request->all();
      $measurements = [];
      if ($input['category_id'])
        $measurements = MeasurementUnit::where('category_id', $input['category_id'])->join('category_measurement_units', 'measurement_units.id', '=', 'category_measurement_units.measurement_unit_id')->get();
      return response()->json($measurements); 

    }


}