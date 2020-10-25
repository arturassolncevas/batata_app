<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    private $pagination;

    public function __construct($resource, $pagination = null, $sorting = null) {
        parent::__construct($resource);
        $this->pagination = $pagination;
        $this->sorting = $sorting;
    }

    public function toArray($request)
    {
      return [
        'data' => $this->collection->toArray(),
        'pagination' => $this->pagination,
        'sort' => $this->sorting
      ];
    }
}
