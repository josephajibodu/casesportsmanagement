@php
    $hasCoaches = \App\Models\Talent::query()->published()->where('type', 'coach')->exists();

    $navLinks = array_values(array_filter([
        ['label' => 'About', 'route' => 'about'],
        ['label' => 'Players', 'route' => 'players.index'],
        $hasCoaches ? ['label' => 'Coaches', 'route' => 'coaches.index'] : null,
        ['label' => 'News', 'route' => 'news.index'],
        ['label' => 'Gallery', 'route' => 'gallery'],
        ['label' => 'Partners', 'route' => 'partners'],
    ]));
@endphp

<header class="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
    <nav class="shell flex h-18 items-center justify-between gap-6">
        <a href="{{ route('home') }}" class="flex items-center" aria-label="{{ $settings->agency_name }} home">
            <x-brand-mark class="h-12 w-auto sm:h-14" />
        </a>

        <div class="hidden items-center gap-8 lg:flex">
            @foreach ($navLinks as $link)
                <a
                    href="{{ route($link['route']) }}"
                    @class([
                        'text-sm font-medium tracking-wide transition hover:text-white',
                        'text-white' => request()->routeIs($link['route']),
                        'text-mist-dim' => ! request()->routeIs($link['route']),
                    ])
                >{{ $link['label'] }}</a>
            @endforeach
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('contact') }}" class="btn btn-primary hidden sm:inline-flex">Get in touch</a>
            <button
                type="button"
                data-nav-toggle
                class="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
                aria-label="Toggle navigation"
            >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
                </svg>
            </button>
        </div>
    </nav>

    <div id="mobile-nav" class="hidden border-t border-white/10 lg:hidden">
        <div class="shell flex flex-col py-4">
            @foreach ($navLinks as $link)
                <a href="{{ route($link['route']) }}" class="py-2.5 text-sm font-medium text-mist-dim hover:text-white">{{ $link['label'] }}</a>
            @endforeach
            <a href="{{ route('contact') }}" class="btn btn-primary mt-3 w-full">Get in touch</a>
        </div>
    </div>
</header>
