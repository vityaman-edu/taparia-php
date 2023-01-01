<?php
session_start();
ini_set('display_errors', true);

include_once 'web/Request.php';
include_once 'web/Handler.php';
include_once 'TapHandler.php';
include_once 'TapResult.php';

try {
    $request = Request::extract();
    MethodChoiceRequestHandler::of([
        'POST' => new TapHandler()
    ])->route($request->url())->handle($request);
} catch (Exception $e) {
    header('HTTP/1.1 400 Bad request');
    echo $e->getMessage();
}