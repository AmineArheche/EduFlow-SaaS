<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request and verify user roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // 1. Ensure user is authenticated
        if (!$user) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please provide a valid Bearer token.',
                ], 401);
            }

            return redirect()->guest('/login');
        }

        // 2. Check if account status is active
        if ($user->status !== 'active') {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access Denied: Your account is suspended or inactive.',
                    'status' => $user->status,
                ], 403);
            }

            abort(403, 'Your account is suspended or inactive.');
        }

        // 3. Super admin bypass or verify specific role
        if (!in_array($user->role, $roles, true)) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access. Insufficient role permissions.',
                    'current_role' => $user->role,
                    'required_roles' => $roles,
                ], 403);
            }

            abort(403, 'Unauthorized. You do not have the required role.');
        }

        return $next($request);
    }
}
