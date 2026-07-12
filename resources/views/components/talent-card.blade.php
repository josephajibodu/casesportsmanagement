@props(['talent'])

@php
    $photo = media_url($talent->photo);
    $initials = collect(explode(' ', $talent->full_name))->take(2)->map(fn ($p) => Str::substr($p, 0, 1))->implode('');
@endphp

<a
    href="{{ $talent->publicUrl() }}"
    class="group relative block overflow-hidden rounded-2xl border border-white/10 bg-ink-800"
>
    <div class="relative aspect-4/5 overflow-hidden">
        @if ($photo)
            <img
                src="{{ $photo }}"
                alt="{{ $talent->full_name }}"
                loading="lazy"
                class="size-full object-cover transition duration-700 group-hover:scale-105"
            >
        @else
            <div class="flex size-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                <span class="font-serif text-5xl font-semibold text-white/25">{{ $initials }}</span>
            </div>
        @endif

        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>

        {{-- position badge --}}
        @if ($talent->position)
            <span class="absolute left-4 top-4 rounded-full bg-brand-500/90 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-wider text-ink">
                {{ $talent->position }}
            </span>
        @endif

        <span class="absolute right-4 top-4 rounded-full border border-white/20 bg-ink/50 px-3 py-1 font-condensed text-[0.65rem] font-semibold uppercase tracking-wider text-mist backdrop-blur-sm">
            {{ ucfirst($talent->type) }}
        </span>
    </div>

    <div class="absolute inset-x-0 bottom-0 p-5">
        <h3 class="font-serif text-xl font-semibold text-white">{{ $talent->full_name }}</h3>
        <div class="mt-1 flex items-center gap-2 text-sm text-mist-dim">
            @if ($talent->current_club)<span>{{ $talent->current_club }}</span>@endif
            @if ($talent->current_club && $talent->nationality)<span class="text-mist-faint">·</span>@endif
            @if ($talent->nationality)<span>{{ $talent->nationality }}</span>@endif
        </div>
        <span class="mt-4 inline-flex items-center gap-1.5 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 opacity-0 transition group-hover:opacity-100">
            View Profile
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
    </div>
</a>
