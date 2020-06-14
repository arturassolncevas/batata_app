<?php

  namespace App\Services;

  class FileUtils {

    public static function get_base64_extension($base64) {
        $extension = explode('/', explode(':', substr($base64, 0, strpos($base64, ';')))[1])[1]; 
        return $extension;
    }

    public static function strip_base64_extension($base64) {
        $base64 = substr($base64, strpos($base64, ',') + 1);
        return $base64;
    }
  }
