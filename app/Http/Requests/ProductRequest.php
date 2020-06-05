<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Phonearea;

class ProductRequest extends FormRequest
{
    private $validation_steps = [
      'step_2' => [
        'price' => 'required|numeric|between:0.01,999999.99',
        'measurement_unit_id' => 'required',
        'quantity' => 'required|numeric',
        'product_attributes.*' => 'product_attribute'
      ],
      'step_3' => []
    ];
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $method = explode('@', $this->route()->getActionName())[1];
        return $this->get_rules_arr($method);
    }

    public function get_rules_arr($method) {
        $result = [];
        switch ($method) {
            case "step_2":
                $result = $this->validation_steps['step_2'];
                break;
            case "step_3":
                $result = $this->validation_steps['step_3'];
                break;
            case "step_4":
                foreach ($this->validation_steps as $step_rules) {
                    $result = array_merge($result, $step_rules);
                }
                break;
        }
        return $result;
    }
}
