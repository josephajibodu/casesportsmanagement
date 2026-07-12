@extends('layouts.public')

@section('title', 'About Us')
@section('meta_description', 'Learn about ' . $settings->agency_name . ', a FIFA-licensed football agency representing players and coaches worldwide.')

@section('content')
    {{-- ============================ INTRO ============================ --}}
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-28">
            <x-section-heading
                eyebrow="Who we are"
                title="Built on trust. Driven by ambition."
                :intro="$settings->tagline"
            />
        </div>
    </section>

    {{-- ============================ STORY ============================ --}}
    <section class="section section-light">
        <div class="shell grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div class="prose-light max-w-none">
                @foreach (preg_split('/\n\s*\n/', trim($settings->agency_story ?? '')) as $paragraph)
                    <p>{{ $paragraph }}</p>
                @endforeach
            </div>

            <div class="space-y-4">
                @if ($settings->mission)
                    <div class="card-light p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Our Mission</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ $settings->mission }}</p>
                    </div>
                @endif
                @if ($settings->vision)
                    <div class="card-light p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-gold-700">Our Vision</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ $settings->vision }}</p>
                    </div>
                @endif
                @if ($settings->fifa_license_info)
                    <div class="rounded-2xl border border-gold-500/30 bg-gold-400/10 p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-gold-700">FIFA Licensed</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-700">{{ $settings->fifa_license_info }}</p>
                    </div>
                @endif
            </div>
        </div>
    </section>

    {{-- ============================ TEAM ============================ --}}
    @if ($teamMembers->isNotEmpty())
        <section class="section border-t border-white/10 bg-ink-950">
            <div class="shell">
                <x-section-heading eyebrow="The team" title="Experience you can trust" gold />
                <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach ($teamMembers as $member)
                        @php
                            $photo = media_url($member->photo);
                            $initials = collect(explode(' ', $member->full_name))->take(2)->map(fn ($p) => \Illuminate\Support\Str::substr($p, 0, 1))->implode('');
                        @endphp
                        <div class="surface overflow-hidden">
                            <div class="relative aspect-square overflow-hidden">
                                @if ($photo)
                                    <img src="{{ $photo }}" alt="{{ $member->full_name }}" loading="lazy" class="size-full object-cover">
                                @else
                                    <div class="flex size-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                                        <span class="font-serif text-4xl font-semibold text-white/25">{{ $initials }}</span>
                                    </div>
                                @endif
                            </div>
                            <div class="p-5">
                                <h3 class="font-serif text-lg font-semibold text-white">{{ $member->full_name }}</h3>
                                @if ($member->title)
                                    <p class="mt-0.5 font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-brand-400">{{ $member->title }}</p>
                                @endif
                                @if ($member->bio)
                                    <p class="mt-3 text-sm leading-relaxed text-mist-dim">{{ $member->bio }}</p>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    @include('public.partials.contact-cta')
@endsection
