@props(['article'])

@php $image = media_url($article->featured_image); @endphp

<article class="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition hover:border-white/20">
    <a href="{{ route('news.show', $article) }}" class="relative block aspect-16/10 overflow-hidden">
        @if ($image)
            <img src="{{ $image }}" alt="{{ $article->title }}" loading="lazy" class="size-full object-cover transition duration-700 group-hover:scale-105">
        @else
            <div class="size-full bg-gradient-to-br from-ink-700 to-ink-900"></div>
        @endif
        @if ($article->category)
            <span class="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-condensed text-[0.65rem] font-semibold uppercase tracking-wider text-brand-300 backdrop-blur-sm">
                {{ $article->category }}
            </span>
        @endif
    </a>

    <div class="flex flex-1 flex-col p-6">
        <time class="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-mist-faint">
            {{ $article->published_at?->format('j M Y') }}
        </time>
        <h3 class="mt-3 font-serif text-xl font-semibold leading-snug text-white">
            <a href="{{ route('news.show', $article) }}" class="transition hover:text-brand-300">{{ $article->title }}</a>
        </h3>
        @if ($article->excerpt)
            <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-mist-dim">{{ $article->excerpt }}</p>
        @endif
        <a href="{{ route('news.show', $article) }}" class="mt-5 inline-flex items-center gap-1.5 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Read more
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
    </div>
</article>
