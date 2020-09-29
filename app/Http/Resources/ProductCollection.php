<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Product;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    private $pagination;

    public function __construct($resource, $pagination = null) {
        parent::__construct($resource);
        $this->pagination = $pagination;
    }

    public function toArray($request)
    {
      return [
        'data' => $this->collection,
        'pagination' => $this->pagination
      ];
    }
}
