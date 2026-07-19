@extends('layouts.public')

@section('title', $article->meta_title ?: $article->title)
@section('meta_description', $article->meta_description ?: $article->excerpt)
@section('og_image', media_url($article->featured_image) ?? asset('images/logo.png'))

@section('content')
    @php $image = media_url($article->featured_image); @endphp

    <article>
        <header class="relative overflow-hidden border-b border-white/10">
            <div class="pitch-grid pointer-events-none absolute inset-0"></div>
            <div class="shell relative max-w-3xl py-16 sm:py-20">
                <a href="{{ route('news.index') }}" class="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-mist-faint transition hover:text-white">&larr; Back to news</a>
                <div class="mt-6 flex flex-wrap items-center gap-3">
                    @if ($article->category)
                        <span class="rounded-full bg-brand-500/15 px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-wider text-brand-300">{{ $article->category }}</span>
                    @endif
                    <time class="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-mist-faint">{{ $article->published_at?->format('j M Y') }}</time>
                </div>
                <h1 class="mt-5 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">{{ $article->title }}</h1>
                <p class="mt-4 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{{ $settings->agency_name }}</p>
            </div>
        </header>

        @if ($image)
            <div class="shell -mt-2 py-10">
                <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10">
                    <img src="{{ $image }}" alt="{{ $article->title }}" class="w-full object-cover">
                </div>
            </div>
        @endif

        <div class="shell pb-16">
            <div class="prose-dark mx-auto max-w-3xl">
                {!! $article->body !!}
            </div>
        </div>
    </article>

    @if ($related->isNotEmpty())
        <section class="section border-t border-white/10 bg-ink-950">
            <div class="shell">
                <x-section-heading eyebrow="Keep reading" title="Recent articles" gold />
                <div class="mt-12 grid gap-6 md:grid-cols-3">
                    @foreach ($related as $item)
                        <x-news-card :article="$item" />
                    @endforeach
                </div>
            </div>
        </section>
    @endif
@endsection
