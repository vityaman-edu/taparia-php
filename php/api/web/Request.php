<?php
include_once 'URL.php';

abstract class Request {
    private string $method;
    private URL $url;

    public function __construct(string $method, URL $url) {
        $this->method = $method;
        $this->url = $url;
    }

    public function method(): string {
        return $this->method;
    }

    public function url(): URL {
        return $this->url;
    }

    public static function extract(): Request {
        $url = URL::fromString(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH));
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
            case 'GET': 
                return new GetRequest($url, $_GET);
            case 'POST': 
                return new PostRequest($url, $_POST);
            default:  {
                throw new Exception('Method ' . $method . ' is not supported');
            }
        }
    }
}

class GetRequest extends Request {
    private array $queryParameters;

    public function __construct(URL $url, array $queryParameters) {
        parent::__construct('GET', $url);
        $this->queryParameters = $queryParameters;
    }

    public function queryParameters(): array {
        return $this->queryParameters;
    }
}

class PostRequest extends Request {
    private array $body;

    public function __construct(URL $url, array $body) {
        parent::__construct('POST', $url);
        $this->body = $body;
    }

    public function body(): array {
        return $this->body;
    }
}

