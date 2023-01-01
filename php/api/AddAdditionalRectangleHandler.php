<?php
include_once 'web/Handler.php';
include_once 'web/Request.php';
include_once 'geometry/Polygon.php';


class AddAdditionalRectangleHandler extends RequestHandler {
    public function handle(GetRequest | PostRequest $request): void {
        if (!isset($request->body()['rect'])) {
            throw new ValidationException("expected rect field");
        }
        $rectJson = $request->body()['rect'];
        $rect = Polygon::fromJson($rectJson);

        if (!isset($_SESSION['additionalPolygons'])) {
            $_SESSION['additionalPolygons'] = array();
        }
        $rects = $_SESSION['additionalPolygons'];
        array_push($rects, $rect->json());
        $_SESSION['additionalPolygons'] = $rects;
        
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=utf-8');
        echo 'ok';
    } 
}