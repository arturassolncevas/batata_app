<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\Currency as CurrencyResource;
use App\Http\Resources\LineItem as LineItemResource;
use App\Http\Resources\MeasurementUnit as MeasurementUnitResource;

class Order extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
          'id' => $this->id,
          'total' => $this->total,
          'status' => $this->status,
          'date_paid' => $this->date_paid,
          'total_tax' => $this->total_tax,
          'include_tax' => $this->include_tax,
          'customer_note' => $this->customer_note,
          'date_completed' => $this->date_completed,
          'billing_address' => $this->billing_address,
          'delivery_address' => $this->delivery_address,
          'customer' => new UserResource($this->customer),
          'currency' => new CurrencyResource($this->currency),
          'line_items' => LineItemResource::collection($this->line_items),
          'created_at' => $this->created_at
        ];
    }
}
