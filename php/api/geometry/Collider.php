<?php
include_once 'Vector.php';
include_once 'JsonObject.php';

abstract class Collider implements JsonObject {
    private string $type;

    public function __construct(string $type) {
        $this->type = $type;
    }

    public function type(): string {
        return $this->type;
    }

    abstract public function contains(Vector $point): bool;

    // static function parseJson(array $json): Collider {
    //     $type = $json['type'];
    //     switch ($type) {
    //         case 'union': return Union::parseJson($json);
    //         case 'intersection': return Intersection::parseJson($json);
    //         case 'inverse': return Inverse::parseJson($json);
    //         case 'ellipse': return Ellipse::parseJson($json);
    //         case 'polygon': return Polygon::parseJson($json);
    //         default: throw new Exception('No such collider type: ' . $type);
    //     }
    // }
}

abstract class ComplexCollider extends Collider {
    protected array $colliders;

    public function __construct(string $type, Collider ...$colliders) {
        parent::__construct($type);
        $this->colliders = $colliders;
    }

    public function json(): array {
        return array(
            'type' => $this->type(),
            'parts' => array_map(
                function (Collider $collider) {
                    return $collider->json();
                },
                $this->colliders
            )
        );
    }
}

function union(Collider ...$colliders): Collider {
    return new Union(...$colliders);
}

class Union extends ComplexCollider {
    public function __construct(Collider ...$colliders) {
        parent::__construct('union', ...$colliders);
    }

    public function contains(Vector $point): bool {
        return count(
            array_filter(
                $this->colliders, 
                function (Collider $collider) use ($point) {
                    return $collider->contains($point);
                }
            )
        ) > 0;
    }

    // static function parseJson(array $json): Collider {
    //     return new Union(
    //         array_map(
    //             function (array $json) {
    //                 return Collider::parseJson($json);
    //             },
    //             $json['parts']
    //         )
    //     );
    // }
}

function intersection(Collider ...$colliders): Collider {
    return new Intersection(...$colliders);
}

class Intersection extends ComplexCollider {
    public function __construct(Collider ...$colliders) {
        parent::__construct('intersection', ...$colliders);
    }

    public function contains(Vector $point): bool {
        return count(
            array_filter(
                $this->colliders, 
                function (Collider $collider) use ($point) {
                    return !$collider->contains($point);
                }
            )
        ) == 0;
    }

    // static function parseJson(array $json): Collider {
    //     return new Intersection(
    //         array_map(
    //             function (array $json) {
    //                 return Collider::parseJson($json);
    //             },
    //             $json['parts']
    //         )
    //     );
    // }
}

function inverse(Collider $collider): Collider {
    return new Inverse($collider);
}

class Inverse extends Collider {
    private Collider $collider;

    public function __construct(Collider $collider) {
        parent::__construct("inverse");
        $this->collider = $collider;
    }

    public function contains(Vector $point): bool {
        return !$this->collider->contains($point);
    }

    public function json(): array {
        return array(
            'type' => $this->type(),
            'inner' => $this->collider->json()
        );
    }

    // static function parseJson(array $json): Collider {
    //     return new Inverse(Collider::parseJson($json['inner']));
    // }
}
