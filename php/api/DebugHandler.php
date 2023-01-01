<?php
include_once 'web/Handler.php';

class DebugHandler extends RequestHandler {
    private string $text;

    public function __construct(string $text) {
        $this->text = $text;
    }

    public function handle(GetRequest | PostRequest $request): void {
        echo json_encode([
            'Result' => $this->text
        ]);
        if ($request->method() == 'POST') {
            echo json_encode($request->body());
        } else { 
            echo json_encode($request->queryParameters());
        }
    }
}
