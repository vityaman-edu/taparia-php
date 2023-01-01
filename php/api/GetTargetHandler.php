<?php
include_once 'Target.php';
include_once 'web/Handler.php';
include_once 'geometry/Polygon.php';

class GetTargetHandler extends RequestHandler {
    public function handle(GetRequest | PostRequest $request): void {
        $r = $request->queryParameters()['r'];

        if (!isset($_SESSION['additionalPolygons'])) {
            $_SESSION['additionalPolygons'] = array();
        }
        $additionalPolygons = $_SESSION['additionalPolygons'];
        $additionalPolygons = array_map(
            function (array $json) {
                return Polygon::fromJson($json);
            },
            $additionalPolygons
        );

        $target = new Target($r, $additionalPolygons);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=utf-8');
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        echo json_encode($target->json());
    }
}
