<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckRole
{
    public function handle($request, Closure $next, ...$roles)
    {
        $role = Auth::user()?->user_type;

        if (!$role || !in_array($role, $roles)) {
            return Inertia::render('Errors/403', [
                'message' => 'Sorry, you do not have permission to view this page.'
            ]);
        }

        return $next($request);
    }
}
