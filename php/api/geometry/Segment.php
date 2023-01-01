<?php
include_once 'Vector.php';

class Segment {
    private Vector $start;
    private Vector $end;

    public function __construct(Vector $start, Vector $end) {
        $this->start = $start;
        $this->end = $end;
    }

    /** https://stackoverflow.com/questions/217578/
     * how-can-i-determine-whether-a-2d-point-is-within-a-polygon */
    public function intersects(Segment $other): bool {
        return !Segment::areD1AndD2SuitableHaveSameSign($this, $other) &&
            !Segment::areD1AndD2SuitableHaveSameSign($other, $this);
    }

    public function start() {
        return $this->start;
    }

    public function end() {
        return $this->end;
    }

    static function standartLinearEquationFormOf(Segment $segment) {
        return [
            $segment->end()->y() - $segment->start()->y(),
            $segment->start()->x() - $segment->end()->x(),
            ($segment->end()->x() * $segment->start()->y()) - ($segment->start()->x() * $segment->end()->y())
        ];
    }

    static function areD1AndD2SuitableHaveSameSign(Segment $first, Segment $second) {
        [$a, $b, $c] = Segment::standartLinearEquationFormOf($first);
        $d1 = ($a * $second->start()->x()) + ($b * $second->start()->y()) + $c;
        $d2 = ($a * $second->end()->x()) + ($b * $second->end()->y()) + $c;
        return ($d1 > 0 && $d2 > 0 || $d1 < 0 && $d2 < 0);
    }
}
