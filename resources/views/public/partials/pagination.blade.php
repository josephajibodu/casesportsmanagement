@if ($paginator->hasPages())
    <nav class="flex items-center justify-center gap-2" role="navigation" aria-label="Pagination">
        {{-- Previous --}}
        @if ($paginator->onFirstPage())
            <span class="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-mist-faint opacity-40">&larr;</span>
        @else
            <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-mist transition hover:border-brand-400 hover:text-white">&larr;</a>
        @endif

        @foreach ($elements as $element)
            @if (is_string($element))
                <span class="px-2 text-mist-faint">{{ $element }}</span>
            @endif
            @if (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <span class="inline-flex size-10 items-center justify-center rounded-full bg-brand-500 font-condensed text-sm font-semibold text-ink">{{ $page }}</span>
                    @else
                        <a href="{{ $url }}" class="inline-flex size-10 items-center justify-center rounded-full border border-white/15 font-condensed text-sm text-mist transition hover:border-brand-400 hover:text-white">{{ $page }}</a>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Next --}}
        @if ($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-mist transition hover:border-brand-400 hover:text-white">&rarr;</a>
        @else
            <span class="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-mist-faint opacity-40">&rarr;</span>
        @endif
    </nav>
@endif
