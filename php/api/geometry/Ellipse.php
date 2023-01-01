<?php
include_once 'Collider.php';
include_once 'Vector.php';

class Ellipse extends Collider {
    private Vector $center;
    private Vector $radius;

    public function __construct(Vector $center, Vector $radius) {
        parent::__construct("ellipse");
        $this->center = $center;
        $this->radius = $radius;
    }

    public function contains(Vector $point): bool {
        return pow($point->x() - $this->center->x(), 2) / pow($this->radius->x(), 2) +
            pow($point->y() - $this->center->y(), 2) / pow($this->radius->y(), 2) <= 1;
    }

    public function json(): array {
        return array(
            'type' => $this->type(),
            'center' => $this->center->json(),
            'radius' => $this->radius->json()
        );
    }
}