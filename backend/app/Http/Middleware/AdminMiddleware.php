<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'unauthenticated',
                    'message' => 'Authentication required.',
                ], 401);
            }

            return redirect()->guest(route('admin.login'));
        }

        if (! $request->user()->isAdmin()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'forbidden',
                    'message' => 'Restricted Area: Platform Administrator privileges required.',
                ], 403);
            }

            return redirect()->route('admin.login')->withErrors([
                'email' => 'Restricted Area: Platform Administrator privileges required.',
            ]);
        }

        return $next($request);
    }
}

