<?php

namespace App\Http\Managers;

use App\Models\Address;
use DB;

class AddressManager {
   function __construct($params) {
    $this->params = $params; 
    $this->address = null;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->address = new Address($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->address->save();
    });
    return $this->address;
  }

  function update($address, $options = ["save" => true]) {
    DB::transaction(function () use(&$address, &$options) {
      $this->address = $address;
      $this->address->update($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->address->save();
    });
    return $this->address;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["country"])) {
        $this->address->{$key}()->associate($value);
      }
    }
  }
}