@extends('layouts.public')

@section('title', 'News & Press')
@section('meta_description', 'The latest news, announcements, and press from ' . $settings->agency_name . '.')

@section('content')
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-24">
            <x-section-heading eyebrow="News & Press" title="Latest from the agency" intro="Updates on our players, coaches, and the agency." />
        </div>
    </section>

    <section class="section shell">
        {{-- Category filter --}}
        <div class="mb-10 flex flex-wrap gap-2">
            <a href="{{ route('news.index') }}" @class([
                'rounded-full px-4 py-2 font-condensed text-xs font-semibold uppercase tracking-wider transition',
                'bg-brand-500 text-ink' => $activeCategory === '',
                'border border-white/15 text-mist-dim hover:text-white' => $activeCategory !== '',
            ])>All</a>
            @foreach ($categories as $category)
                <a href="{{ route('news.index', ['category' => $category]) }}" @class([
                    'rounded-full px-4 py-2 font-condensed text-xs font-semibold uppercase tracking-wider transition',
                    'bg-brand-500 text-ink' => $activeCategory === $category,
                    'border border-white/15 text-mist-dim hover:text-white' => $activeCategory !== $category,
                ])>{{ $category }}</a>
            @endforeach
        </div>

        @if ($articles->isEmpty())
            <div class="surface py-20 text-center">
                <p class="text-mist-dim">No articles published yet. Please check back soon.</p>
            </div>
        @else
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                @foreach ($articles as $article)
                    <x-news-card :article="$article" />
                @endforeach
            </div>

            <div class="mt-12">
                {{ $articles->links('public.partials.pagination') }}
            </div>
        @endif
    </section>
@endsection
