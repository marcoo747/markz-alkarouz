<?php

namespace App\Http\Middleware;

use App\Services\RequestLifecycleService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProcessDelayedRequests
{
    public function __construct(
        private readonly RequestLifecycleService $lifecycleService
    ) {
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $this->lifecycleService->processDelayedPendingRequests();

        return $next($request);
    }
}
