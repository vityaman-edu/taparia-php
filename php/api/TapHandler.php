<?php
include_once 'Target.php';
include_once 'web/Handler.php';
include_once 'TapResult.php';
include_once 'geometry/Polygon.php';
include_once 'error/ValidationException.php';

class TapHandler extends RequestHandler {
    public function handle(GetRequest | PostRequest $request): void {
        $currentTime = microtime(true);

        TapHandler::validateParam('x', $request->body());
        $x = substr($request->body()['x'], 0, 50);
        TapHandler::validateParam('y', $request->body());
        $y = substr($request->body()['y'], 0, 50);
        TapHandler::validateParam('r', $request->body());
        $r = substr($request->body()['r'], 0, 50);
        
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
        $point = new Vector($x, $y);
        $hit = $target->contains($point);

        $endTime = microtime(true);

        $result = (new TapResult(
            $hit, 
            $currentTime,
            number_format($endTime - $currentTime, 10, ".", "") * 1000000, 
            $point
        ))->json();

        if (!isset($_SESSION['_results'])) {
            $_SESSION['_results'] = array();
        }
        
        $_SESSION['_results'][count($_SESSION['_results'])] = $result;
        
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array_merge(
            $result, ['target' => $target->json()]
        ));
    }

    private static function validateParam(string $field, array $array) {
        if (!isset($array[$field])) {
            throw ValidationException::from(
                $field . " is defined", 
                $field . " key not found"
            );
        }
        if (!is_numeric($array[$field])) {
            throw ValidationException::from(
                $field . " is a number", 
                $field . " is not a number: " . $array[$field]
            );
        }
        if (strlen($array[$field]) > 50) {
            throw ValidationException::from(
                $field . " length < 50", 
                $field . " it is not: " . $array[$field]
            );
        }
    }
}
