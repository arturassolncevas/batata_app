<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Request;
use Illuminate\Auth\AuthenticationException;
use Response;
use Illuminate\Support\Arr;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    protected function unauthenticated($request, AuthenticationException $exception){
        if ($request->expectsJson()) {
            return response()->json(['message' => $exception->getMessage()], 401);
         }
    }


    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        return parent::render($request, $exception);
    }

    protected function invalidJson($request, $exception)
    {
        $jsonResponse = parent::invalidJson($request, $exception);
        $original = (array) $jsonResponse->getData();
        $jsonResponse->setData(array_merge($original, [
            'statusCode'    => $exception->status,
            'errors'        => $this->expandDotNotationKeys((array) $original['errors']),
        ]));

        return $jsonResponse;
    }

    public  function expandDotNotationKeys(Array $array)
    {
        $result = [];
        foreach ($array as $key => $value) {
          Arr::set($result, $key, $value);
        }
        return $result;
    }
}
