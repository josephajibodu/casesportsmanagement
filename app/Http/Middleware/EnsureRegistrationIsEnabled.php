<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationIsEnabled
{
    /**
     * Block access to the registration routes unless an admin has enabled it in settings.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! SiteSetting::current()->registration_enabled) {
            return redirect()->route('login')
                ->with('status', 'Registration is currently disabled. Contact an administrator for access.');
        }

        return $next($request);
    }
}
