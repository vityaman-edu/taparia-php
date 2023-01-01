<?php
include_once 'Target.php';
include_once 'web/Handler.php';
include_once 'TapResult.php';

class GetResultsHandler extends RequestHandler {
    public function handle(GetRequest | PostRequest $request): void {
        if (!isset($_SESSION['_results'])) {
            $_SESSION['_results'] = array();
        }
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['results' => $_SESSION['_results']]);
    }
}