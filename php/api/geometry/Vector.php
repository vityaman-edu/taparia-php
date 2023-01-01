<?php
include_once 'JsonObject.php';

class Vector implements JsonObject {
    private float $x;
    private float $y;

    public function __construct(float $x, float $y) {
        $this->x = $x;
        $this->y = $y;
    }

    public function x(): float {
        return $this->x;
    }

    public function y(): float {
        return $this->y;
    }

    public function json(): array {
        return array(
            'x' => $this->x,
            'y' => $this->y
        );
    }

    public static function fromJson(array $json) {
        if (!isset($json['x'])) {
            throw new ValidationException("expected x field");
        }
        if (!is_numeric($json['x'])) {
            throw new ValidationException(
                "expected x number, but it is: " . $json['x']
            );
        }
        if (!isset($json['y'])) {
            throw new ValidationException("expected y field");
        }
        if (!is_numeric($json['y'])) {
            throw new ValidationException(
                "expected y number, but it is: " . $json['y']
            );
        }
        return new Vector($json['x'], $json['y']);
    }
}
