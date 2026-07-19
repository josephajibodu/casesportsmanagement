<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $metaTitle = trim($__env->yieldContent('title', $settings->agency_name));
            $pageTitle = $metaTitle === $settings->agency_name
                ? $settings->agency_name.' | FIFA-Licensed Football Agency'
                : $metaTitle.' | '.$settings->agency_name;
            $metaDescription = trim($__env->yieldContent('meta_description', $settings->tagline ?? ''));
            $ogImage = $__env->yieldContent('og_image', asset('images/logo.png'));
        @endphp

        <title>{{ $pageTitle }}</title>
        <meta name="description" content="{{ $metaDescription }}">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph / social --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $settings->agency_name }}">
        <meta property="og:title" content="{{ $pageTitle }}">
        <meta property="og:description" content="{{ $metaDescription }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta name="twitter:card" content="summary_large_image">

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">

        @php
            Illuminate\Support\Facades\Vite::useBuildDirectory('build-static')
                ->useHotFile(public_path('build-static/hot'));
        @endphp

        @fonts

        @vite(['resources/css/static.css', 'resources/js/static.js'], 'build-static')

        @stack('head')
    </head>
    <body class="min-h-screen bg-ink font-sans text-mist antialiased">
        <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-ink">
            Skip to content
        </a>

        @include('public.partials.nav')

        <main id="main">
            @yield('content')
        </main>

        @include('public.partials.footer')

        <script>
            // Mobile navigation toggle
            document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var menu = document.getElementById('mobile-nav');
                    if (menu) { menu.classList.toggle('hidden'); }
                });
            });
        </script>

        @stack('scripts')
    </body>
</html>
