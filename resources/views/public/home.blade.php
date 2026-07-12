@extends('layouts.public')

@section('meta_description', $settings->tagline)

@section('content')
    {{-- ============================ HERO ============================ --}}
    <section class="relative overflow-hidden">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-10%,rgba(16,185,129,0.18),transparent)]"></div>
        <div class="pitch-grid-hero pointer-events-none absolute inset-0"></div>
        <div class="pitch-markings pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute -right-40 top-1/4 size-[28rem] rounded-full bg-brand-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -left-40 bottom-0 size-[24rem] rounded-full bg-gold-500/10 blur-3xl"></div>

        <div class="shell relative flex flex-col items-center py-24 text-center sm:py-32 lg:py-36">
            <span class="eyebrow eyebrow-gold rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5">
                <span class="size-1.5 rounded-full bg-gold-400"></span>
                {{ $settings->fifa_license_info ?: 'FIFA-Licensed Football Agency' }}
            </span>

            <h1 class="mt-8 max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Global reach.
                <span class="block italic text-gold-gradient">Personal approach.</span>
            </h1>

            <p class="mt-7 max-w-2xl text-lg leading-relaxed text-mist">
                {{ $settings->tagline ?: 'Elite football representation, tailored for long-term success.' }}
                We guide players and coaches through every stage of their careers — on and off the pitch.
            </p>

            <div class="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="{{ route('contact') }}" class="btn btn-gold">Start the conversation</a>
                <a href="{{ route('players.index') }}" class="btn btn-ghost">Meet our players</a>
            </div>

            @if (! empty($settings->stats))
                <div class="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4">
                    @foreach ($settings->stats as $stat)
                        <div class="bg-ink-900/60 px-4 py-6 text-center">
                            <div class="font-serif text-3xl font-semibold text-white sm:text-4xl">{{ $stat['value'] }}</div>
                            <div class="mt-1 font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-mist-faint">{{ $stat['label'] }}</div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    {{-- ========================= MARQUEE ========================= --}}
    <div class="border-y border-white/10 bg-ink-950 py-4">
        <div class="relative flex overflow-hidden">
            <div class="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
                @php $words = ['Player Representation', 'Contract Negotiation', 'Career Management', 'Transfers', 'Legal Support', 'Branding & Media', 'Performance Analysis', 'Global Network']; @endphp
                @for ($i = 0; $i < 2; $i++)
                    @foreach ($words as $word)
                        <span class="font-condensed text-sm font-semibold uppercase tracking-[0.2em] text-mist-dim">{{ $word }}</span>
                        <span class="text-gold-500">◆</span>
                    @endforeach
                @endfor
            </div>
        </div>
    </div>

    {{-- ========================= SERVICES ========================= --}}
    @if (! empty($settings->services))
        <section class="section section-light">
            <div class="shell">
                <x-section-heading
                    light
                    eyebrow="What we do"
                    title="Complete career management"
                    intro="A full-service agency supporting our clients across every dimension of the professional game."
                />

                @php $grouped = collect($settings->services)->groupBy('group'); @endphp
                <div class="mt-14 grid gap-12 lg:grid-cols-2">
                    @foreach ($grouped as $group => $services)
                        <div>
                            <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">{{ $group }}</h3>
                            <div class="mt-6 grid gap-4 sm:grid-cols-2">
                                @foreach ($services as $service)
                                    <div class="card-light p-5">
                                        <h4 class="text-base font-semibold text-slate-900">{{ $service['title'] }}</h4>
                                        <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ $service['description'] }}</p>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ==================== FEATURED TALENT ==================== --}}
    @if ($featuredTalents->isNotEmpty())
        <section class="section bg-ink-950">
            <div class="shell">
                <div class="flex flex-wrap items-end justify-between gap-6">
                    <x-section-heading
                        gold
                        eyebrow="Our roster"
                        title="A selection of the talent we represent"
                    />
                    <a href="{{ route('players.index') }}" class="btn btn-ghost">View all players</a>
                </div>

                <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($featuredTalents as $talent)
                        <x-talent-card :talent="$talent" />
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ========================= NEWS ========================= --}}
    @if ($latestNews->isNotEmpty())
        <section class="section section-light">
            <div class="shell">
                <div class="flex flex-wrap items-end justify-between gap-6">
                    <x-section-heading light eyebrow="Latest news" title="From the agency" />
                    <a href="{{ route('news.index') }}" class="btn btn-outline">All news</a>
                </div>

                <div class="mt-12 grid gap-6 md:grid-cols-3">
                    @foreach ($latestNews as $article)
                        <x-news-card :article="$article" />
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ======================= GALLERY ======================= --}}
    @if ($galleryItems->isNotEmpty())
        <section class="section border-t border-white/10 bg-ink-950">
            <div class="shell">
                <div class="flex flex-wrap items-end justify-between gap-6">
                    <x-section-heading gold eyebrow="Gallery" title="Moments from the game" />
                    <a href="{{ route('gallery') }}" class="btn btn-ghost">Open gallery</a>
                </div>

                <div class="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
                    @foreach ($galleryItems as $item)
                        <a href="{{ route('gallery') }}" class="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                            @php $src = media_url($item->image_path); @endphp
                            @if ($src)
                                <img src="{{ $src }}" alt="{{ $item->caption }}" loading="lazy" class="size-full object-cover transition duration-700 group-hover:scale-110">
                            @endif
                            <div class="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition group-hover:opacity-100"></div>
                        </a>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ======================= PARTNERS ======================= --}}
    @if ($partners->isNotEmpty())
        <section class="section section-light-alt">
            <div class="shell">
                <x-section-heading light align="center" eyebrow="Trusted by" title="Our partners" />
                <div class="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6">
                    @foreach ($partners as $partner)
                        <div class="font-condensed text-lg font-semibold uppercase tracking-wider text-slate-400 transition hover:text-slate-700">
                            {{ $partner->name }}
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif

    {{-- ======================= CONTACT CTA ======================= --}}
    @include('public.partials.contact-cta')
@endsection
