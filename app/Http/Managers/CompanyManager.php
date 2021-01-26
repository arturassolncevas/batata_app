<?php

namespace App\Http\Managers;

use App\Models\Company;
use DB;

class CompanyManager {
   function __construct($params) {
    $this->params = $params; 
    $this->company = null;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->company = new Company($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->company->save();
    });
    return $this->company;
  }

  function update($company, $options = ["save" => true]) {
    DB::transaction(function () use(&$company, &$options) {
      $this->company = $company;
      $this->company->update($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->company->save();
    });
    return $this->company;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["address"])) {
        $this->company->{$key}()->associate($value);
      }
    }
  }
}