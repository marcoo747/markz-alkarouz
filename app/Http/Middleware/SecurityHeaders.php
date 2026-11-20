<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        if (function_exists('header_remove')) {
            @header_remove('X-Powered-By');
        }

        /** @var Response $response */
        $response = $next($request);

        $isDev = app()->environment(['local', 'testing']);
        $viteScript = $isDev ? ' http://localhost:5173 http://127.0.0.1:5173' : '';
        $viteConnect = $isDev ? ' ws://localhost:5173 ws://127.0.0.1:5173 http://localhost:5173 http://127.0.0.1:5173' : '';

        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'{$viteScript}",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net{$viteScript}",
            "font-src 'self' data: https://fonts.bunny.net",
            "img-src 'self' data: blob:{$viteScript}",
            "connect-src 'self'{$viteConnect}",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);

        $response->headers->remove('X-Powered-By');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
