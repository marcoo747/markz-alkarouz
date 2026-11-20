<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\ProcessDelayedRequests::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                return $response;
            }

            $status = $response->getStatusCode();

            if ($status === 419) {
                return Inertia::render('Errors/419', [
                    'status' => 419,
                    'message' => 'Page Expired',
                ])->toResponse($request)->setStatusCode(419);
            }

            if ($status === 404) {
                return Inertia::render('Errors/404', [
                    'status' => 404,
                ])->toResponse($request)->setStatusCode(404);
            }

            if ($status === 403) {
                return Inertia::render('Errors/403', [
                    'status' => 403,
                    'message' => $e->getMessage() ?: 'Sorry, you do not have permission to view this page.',
                ])->toResponse($request)->setStatusCode(403);
            }

            return $response;
        });
    })
    ->create();
