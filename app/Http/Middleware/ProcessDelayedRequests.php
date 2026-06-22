<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserRequest;

class ProcessDelayedRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for any pending requests that should be updated
        UserRequest::where('request_status', 'pending')
            ->where('expiry_time', '<=', now())
            ->where('expiry_time', '!=', null)
            ->where('request_status', '=', 'pending')
            ->update(['request_status' => 'accepted']);

        return $next($request);
    }
}
