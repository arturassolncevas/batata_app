<?php

namespace App\Http\Managers;

use App\User;
use DB;

class UserManager {
   function __construct($params) {
    $this->params = $params; 
    $this->user = null;
   }

  function create($options = [ "save" => true]) {
    DB::transaction(function () use ($options) {
      $this->user = new User($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->user->save();
    });
    return $this->user;
  }

  function update($user, $options = ["save" => true]) {
    DB::transaction(function () use(&$user, &$options) {
      $this->user = $user;
      $this->user->update($this->params);
      $this->create_associations();
      if ($options["save"])
        $this->user->save();
    });
    return $this->user;
  }

  function create_associations() {
    foreach ($this->params as $key => $value) {
      if (in_array($key, ["country", "language", "currency", "company"])) {
        $this->user->{$key}()->associate($value);
      }
    }
  }
}