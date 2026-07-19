@extends('layouts.public')

@section('title', $talent->meta_title ?: $talent->full_name)
@section('meta_description', $talent->meta_description ?: \Illuminate\Support\Str::limit(strip_tags($talent->biography ?? ''), 155))
@section('og_image', media_url($talent->photo) ?? asset('images/logo.png'))

@section('content')
    @php
        $photo = media_url($talent->photo);
        $gallery = collect($talent->gallery_images ?? [])->map(fn ($p) => media_url($p))->filter();

        $contractLabels = [
            'contracted' => 'Under contract',
            'on_loan' => 'On loan',
            'free_agent' => 'Free agent',
            'youth' => 'Youth contract',
        ];

        // Concise highlights shown in the header.
        $highlights = collect([
            ['Age', $talent->age],
            ['Position', $talent->position],
            ['Nationality', $talent->nationality],
            ['Preferred foot', $talent->preferred_foot ? ucfirst($talent->preferred_foot) : null],
        ])->filter(fn ($item) => filled($item[1]));

        // Full scouting sheet shown in the sidebar.
        $details = collect([
            ['Full name', $talent->full_name],
            ['Date of birth', $talent->date_of_birth?->format('j M Y')],
            ['Age', $talent->age !== null ? $talent->age.' years' : null],
            ['Place of birth', $talent->place_of_birth],
            ['Nationality', $talent->nationality],
            ['Second nationality', $talent->secondary_nationality],
            ['Height', $talent->height_cm ? $talent->height_cm.' cm' : null],
            ['Weight', $talent->weight_kg ? $talent->weight_kg.' kg' : null],
            ['Preferred foot', $talent->preferred_foot ? ucfirst($talent->preferred_foot) : null],
            ['Main position', $talent->position],
            ['Other positions', ! empty($talent->secondary_positions) ? implode(', ', $talent->secondary_positions) : null],
            ['Shirt number', $talent->shirt_number ? '#'.$talent->shirt_number : null],
            ['Current club', $talent->current_club],
            ['Contract status', $talent->contract_status ? ($contractLabels[$talent->contract_status] ?? $talent->contract_status) : null],
            ['Contract until', $talent->contract_until?->format('M Y')],
            ['Market value', $talent->market_value],
        ])->filter(fn ($item) => filled($item[1]));
    @endphp

    {{-- ============================ HEADER ============================ --}}
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_-10%,rgba(16,185,129,0.15),transparent)]"></div>

        <div class="shell relative grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
            <div class="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10">
                <div class="aspect-4/5">
                    @if ($photo)
                        <img src="{{ $photo }}" alt="{{ $talent->full_name }}" class="size-full object-cover">
                    @else
                        <div class="flex size-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                            <span class="font-serif text-6xl font-semibold text-white/25">
                                {{ collect(explode(' ', $talent->full_name))->take(2)->map(fn ($p) => \Illuminate\Support\Str::substr($p, 0, 1))->implode('') }}
                            </span>
                        </div>
                    @endif
                </div>
            </div>

            <div class="flex flex-col justify-center">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full border border-white/15 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-wider text-mist">{{ ucfirst($talent->type) }}</span>
                    @if ($talent->position)
                        <span class="rounded-full bg-brand-500 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-wider text-ink">{{ $talent->position }}</span>
                    @endif
                    @if ($talent->shirt_number)
                        <span class="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-wider text-gold-400">No. {{ $talent->shirt_number }}</span>
                    @endif
                </div>

                <h1 class="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl">{{ $talent->full_name }}</h1>

                @if ($highlights->isNotEmpty())
                    <dl class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4">
                        @foreach ($highlights as [$label, $value])
                            <div class="bg-ink-900/60 px-5 py-4">
                                <dt class="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-mist-faint">{{ $label }}</dt>
                                <dd class="mt-1 text-sm text-white">{{ $value }}</dd>
                            </div>
                        @endforeach
                    </dl>
                @endif

                <div class="mt-8">
                    <a href="{{ route('contact') }}" class="btn btn-gold">Enquire about {{ \Illuminate\Support\Str::before($talent->full_name, ' ') }}</a>
                </div>
            </div>
        </div>
    </section>

    <section class="section shell grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div class="space-y-12">
            {{-- Biography --}}
            @if ($talent->biography)
                <div>
                    <h2 class="font-serif text-2xl font-semibold text-white">Biography</h2>
                    <div class="prose-dark mt-4 max-w-none">{!! nl2br(e($talent->biography)) !!}</div>
                </div>
            @endif

            {{-- Highlight videos (uploaded files + embedded links) --}}
            @if (! empty($talent->video_files) || ! empty($talent->video_links))
                <div>
                    <h2 class="font-serif text-2xl font-semibold text-white">Highlights</h2>
                    <div class="mt-5 grid gap-5 sm:grid-cols-2">
                        @foreach ($talent->video_files ?? [] as $path)
                            @php $src = media_url($path); @endphp
                            @if ($src)
                                <div class="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                                    <video src="{{ $src }}" controls preload="metadata" class="size-full"></video>
                                </div>
                            @endif
                        @endforeach
                        @foreach ($talent->video_links ?? [] as $video)
                            @php $embed = video_embed_url($video['url'] ?? null); @endphp
                            @if ($embed)
                                <div>
                                    <div class="aspect-video overflow-hidden rounded-2xl border border-white/10">
                                        <iframe src="{{ $embed }}" title="{{ $video['label'] ?? 'Highlight video' }}" loading="lazy" allowfullscreen class="size-full"></iframe>
                                    </div>
                                    @if (! empty($video['label']))
                                        <p class="mt-2 text-sm text-mist-dim">{{ $video['label'] }}</p>
                                    @endif
                                </div>
                            @endif
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- Additional gallery --}}
            @if ($gallery->isNotEmpty())
                <div>
                    <h2 class="font-serif text-2xl font-semibold text-white">Gallery</h2>
                    <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        @foreach ($gallery as $src)
                            <div class="aspect-square overflow-hidden rounded-xl border border-white/10">
                                <img src="{{ $src }}" alt="{{ $talent->full_name }}" loading="lazy" class="size-full object-cover">
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

        {{-- Vital statistics + career history --}}
        <aside class="space-y-6">
            @if ($details->isNotEmpty())
                <div class="surface p-6">
                    <h2 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Player details</h2>
                    <dl class="mt-5 divide-y divide-white/10">
                        @foreach ($details as [$label, $value])
                            <div class="flex items-start justify-between gap-4 py-2.5">
                                <dt class="text-sm text-mist-dim">{{ $label }}</dt>
                                <dd class="text-right text-sm font-medium text-white">{{ $value }}</dd>
                            </div>
                        @endforeach
                    </dl>
                </div>
            @endif

            @if (! empty($talent->career_history))
                <div class="surface p-6">
                    <h2 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-brand-400">Career</h2>
                    <ol class="mt-5 space-y-5">
                        @foreach ($talent->career_history as $entry)
                            <li class="relative border-l border-white/10 pl-5">
                                <span class="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-gold-400"></span>
                                <div class="text-sm font-semibold text-white">{{ $entry['club'] ?? '' }}</div>
                                <div class="font-condensed text-xs uppercase tracking-wider text-mist-faint">{{ $entry['years'] ?? '' }}</div>
                            </li>
                        @endforeach
                    </ol>
                </div>
            @endif
        </aside>
    </section>

    {{-- Related --}}
    @if ($related->isNotEmpty())
        <section class="section border-t border-white/10 bg-ink-950">
            <div class="shell">
                <x-section-heading eyebrow="More talent" :title="$talent->type === 'coach' ? 'Other coaches' : 'Other players'" gold />
                <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($related as $item)
                        <x-talent-card :talent="$item" />
                    @endforeach
                </div>
            </div>
        </section>
    @endif
@endsection
