<?php
include_once 'geometry/Collider.php';
include_once 'geometry/Ellipse.php';
include_once 'geometry/Polygon.php';
include_once 'geometry/Vector.php';

class Target extends Collider {
    private Collider $area;
    private array $additionalRectangles; 

    public function __construct(float $r, array $additionalRectangles) {
        parent::__construct("target");
        $this->additionalRectangles = $additionalRectangles;
        $out = new Polygon([
            new Vector(  0,   0), new Vector(0,   $r), new Vector(-$r, $r), 
            new Vector(-$r, -$r), new Vector($r, -$r), new Vector($r,   0)
        ]);
        $circle = new Ellipse(new Vector(0, 0), new Vector($r, $r));
        $rectangle = new Polygon([
            new Vector(0,    0),     new Vector($r,  0),
            new Vector($r, -$r / 2), new Vector(0, -$r / 2)
        ]);
        $triangle = new Polygon([
            new Vector(0, 0), new Vector(-$r / 2, 0), new Vector(0, -$r)
        ]);
        $this->area = new Union(
            new Intersection(
                new Inverse($out), 
                $circle
            ),
            $rectangle, 
            $triangle
        );
    }

    public function contains(Vector $point): bool {
        return $this->area->contains($point) 
            || union(...$this->additionalRectangles)->contains($point);
    }

    public function json(): array {
        return [
            'main' => $this->area->json(),
            'additional' => array_map(
                function (Collider $rect) {
                    return $rect->json();
                },
                $this->additionalRectangles
            )
        ];
    }
}