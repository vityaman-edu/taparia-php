<?php
include_once 'Request.php';

interface Router {
    public function route(URL $url): RequestHandler;
}

class PathRouter implements Router {
    private array $routerByHead;

    public function __construct(array $routerByHead) {
        $this->routerByHead = $routerByHead;
    }

    public function route(URL $url): RequestHandler {
        $head = $url->head();
        if (isset($this->routerByHead[$head])) {
            return $this->routerByHead[$head]->route($url->tail());
        } else {
            return new DefaultRequestHandler();
        }
    }

    public static function of(array $routerByHead): Router {
        return new PathRouter($routerByHead);
    }
}

abstract class RequestHandler implements Router {

    public function route(URL $url): RequestHandler {
        return $this;
    }

    public abstract function handle(GetRequest | PostRequest $request): void;
}

class DefaultRequestHandler extends RequestHandler {
    public function handle(Request $request): void {
        header('HTTP/1.1 404 NotFound');
        echo 'Endpoint ' . $request->method() . ' with url ' . $request->url()->toString() . ' not found';
    }
}

class MethodChoiceRequestHandler extends RequestHandler {
    private array $requestHandlersByMethod;
    private RequestHandler $deafultRequestHandler;

    public function __construct(array $requestHandlersByMethod) {
        $this->requestHandlersByMethod = $requestHandlersByMethod;
        $this->deafultRequestHandler = new DefaultRequestHandler();
    }

    public function handle(Request $request): void {
        if (isset($this->requestHandlersByMethod[$request->method()])) {
            $this->requestHandlersByMethod[$request->method()]->handle($request);
        } else {
            $this->deafultRequestHandler->handle($request);
        }
    }

    public static function of(array $requestHandlersByMethod) {
        return new MethodChoiceRequestHandler($requestHandlersByMethod);
    }
}