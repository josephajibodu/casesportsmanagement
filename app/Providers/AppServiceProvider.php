<?php

namespace App\Providers;

use App\Http\Middleware\EnsureRegistrationIsEnabled;
use App\Models\SiteSetting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->shareSiteSettings();
        $this->gateRegistrationRoutes();
    }

    /**
     * Fortify registers /register itself with no runtime toggle, so gate it here
     * once every provider (including Fortify's) has finished registering routes.
     */
    protected function gateRegistrationRoutes(): void
    {
        $this->app->booted(function () {
            // Named-route lookups aren't refreshed yet at this point (Laravel's own
            // route-loading is itself deferred to a later "booted" callback), so
            // match on the route's name directly instead of Route::getRoutes()->getByName().
            foreach (Route::getRoutes()->getRoutes() as $route) {
                if (in_array($route->getName(), ['register', 'register.store'], true)) {
                    $route->middleware(EnsureRegistrationIsEnabled::class);
                }
            }
        });
    }

    /**
     * Make the singleton site settings available to every public view.
     */
    protected function shareSiteSettings(): void
    {
        View::composer(['layouts.public', 'public.*'], function ($view): void {
            $view->with('settings', SiteSetting::current());
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Schema::defaultStringLength(191);

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
