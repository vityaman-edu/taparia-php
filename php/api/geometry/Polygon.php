<?php
include_once 'Collider.php';
include_once 'Segment.php';
include_once 'Vector.php';
include_once 'error/ValidationException.php';

class Polygon extends Collider {
    private array $points;

    public function __construct(array $points) {
        parent::__construct("polygon");
        $this->points = $points;
    }

    public function contains(Vector $point): bool {
        $ray = new Segment($point, new Vector(999, 999));
        return count(
            array_filter(
                $this->sides(),
                function (Segment $side) use ($ray) {
                    return $side->intersects($ray);
                }
            )
        ) % 2 == 1;
    }

    public function json(): array {
        return array(
            'type' => $this->type(),
            'points' => array_map(
                function (Vector $point): array {
                    return $point->json();
                },
                $this->points
            )
        );  
    }

    private function sides(): array {
        $result = [];
        $count = count($this->points);
        for ($i = 1; $i <= $count; $i++) {
            array_push($result, new Segment(
                    $this->points[$i - 1],
                    $this->points[$i % $count]
                )
            );
        }
        return $result;
    }

    public static function fromJson(array $json): Polygon {
        if (!isset($json['points'])) {
            throw new ValidationException('expected points field');
        }
        return new Polygon(
            array_map(
                function (array $json) {
                    return Vector::fromJson($json);
                },
                $json['points']    
            )
        );
    }
}