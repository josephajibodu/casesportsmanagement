<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @stack('meta')

        <title>@yield('title', config('app.name'))</title>

        <link rel="icon" href="/favicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @php
            Illuminate\Support\Facades\Vite::useBuildDirectory('build-static')
                ->useHotFile(public_path('build-static/hot'));
        @endphp

        @fonts

        @vite(['resources/css/static.css'], 'build-static')

        @stack('head')
    </head>
    <body class="@yield('body_class', 'font-sans antialiased')">
        @yield('content')

        @stack('scripts')
    </body>
</html>
