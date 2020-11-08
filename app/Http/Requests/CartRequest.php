<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends FormRequest
{
    private $validation_steps = [
      'update_cart' => [
        'cart.*' => 'cart_item_quantity',
      ],
      'add_product' => [
        'cart_item' => 'cart_item_quantity',
      ]
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
            case "update":
                $result = $this->validation_steps['update_cart'];
                break;
            case "add_product":
                $result = $this->validation_steps['add_product'];
                break;
        }
        return $result;
    }
}
