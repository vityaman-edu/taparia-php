<?php

class URL {
    private array $parts;

    private function __construct(array $parts) {
        $this->parts = $parts;
    }

    public function head(): string {
        if (isset($this->parts[0])) {
            return $this->parts[0];
        } else {
            return '';
        }
    }

    public function tail(): URL {
        return new URL(array_slice($this->parts, 1));
    }

    public function toString(): string {
        return implode('/', $this->parts);
    }

    public static function fromString(string $string): URL {
        return new URL(array_slice(explode('/', $string), 1));
    }
}
