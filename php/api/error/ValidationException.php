<?php

class ValidationException extends Exception {
    public function __construct($message) {
        parent::__construct($message);
    }

    // custom string representation of object
    public function __toString() {
        return __CLASS__ . ': {$this->message}\n';
    }

    public static function from(string $expectation, string $actual) {
        return new ValidationException(
            $expectation . ' expected, but ' . $actual
        );
    }
}