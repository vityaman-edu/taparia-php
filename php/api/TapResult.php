<?php
include_once './geometry/Vector.php';

class TapResult {
    private bool $hit;
    private int $time;
    private int $latency;
    private Vector $point;

    public function __construct(bool $hit, int $time, int $latency, Vector $point) {
        $this->hit = $hit;
        $this->time = $time;
        $this->latency = $latency;
        $this->point = $point;
    }

    function json() {
        return [
            'hit' => $this->hit,
            'current_time' => $this->time,
            'latency' => $this->latency,
            'x' => $this->point->x(),
            'y' => $this->point->y()
        ];
    }
}