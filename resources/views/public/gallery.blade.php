@extends('layouts.public')

@section('title', 'Gallery')
@section('meta_description', 'Photos and videos from ' . $settings->agency_name . ': events, matches, interviews, and highlights.')

@section('content')
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-24">
            <x-section-heading eyebrow="Gallery" title="Moments from the game" intro="Events, matches, interviews, and highlights." />
        </div>
    </section>

    <section class="section shell">
        {{-- Image / Video tabs --}}
        <div class="mb-8 inline-flex rounded-full border border-white/10 bg-ink-900 p-1">
            <a href="{{ route('gallery', ['tab' => 'image']) }}" @class([
                'rounded-full px-6 py-2 font-condensed text-xs font-semibold uppercase tracking-wider transition',
                'bg-brand-500 text-ink' => $tab === 'image',
                'text-mist-dim hover:text-white' => $tab !== 'image',
            ])>Images</a>
            <a href="{{ route('gallery', ['tab' => 'video']) }}" @class([
                'rounded-full px-6 py-2 font-condensed text-xs font-semibold uppercase tracking-wider transition',
                'bg-brand-500 text-ink' => $tab === 'video',
                'text-mist-dim hover:text-white' => $tab !== 'video',
            ])>Videos</a>
        </div>

        {{-- Category filters --}}
        <div class="mb-10 flex flex-wrap gap-2" data-filter-group>
            <button type="button" data-filter="" class="filter-chip is-active">All</button>
            @foreach ($categories as $category)
                <button type="button" data-filter="{{ $category }}" class="filter-chip">{{ $category }}</button>
            @endforeach
        </div>

        @if ($items->isEmpty())
            <div class="surface py-20 text-center">
                <p class="text-mist-dim">No {{ $tab === 'video' ? 'videos' : 'images' }} in the gallery yet.</p>
            </div>
        @elseif ($tab === 'image')
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" data-grid>
                @foreach ($items as $item)
                    @php $src = media_url($item->image_path); @endphp
                    <button
                        type="button"
                        data-category="{{ $item->category }}"
                        data-lightbox-image="{{ $src }}"
                        data-caption="{{ $item->caption }}"
                        class="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
                    >
                        @if ($src)
                            <img src="{{ $src }}" alt="{{ $item->caption }}" loading="lazy" class="size-full object-cover transition duration-700 group-hover:scale-110">
                        @endif
                        <div class="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                            <span class="text-left text-xs text-white">{{ $item->caption }}</span>
                        </div>
                    </button>
                @endforeach
            </div>
        @else
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-grid>
                @foreach ($items as $item)
                    @php $embed = video_embed_url($item->video_url); @endphp
                    <button
                        type="button"
                        data-category="{{ $item->category }}"
                        data-lightbox-video="{{ $embed }}"
                        data-caption="{{ $item->caption }}"
                        class="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-700 to-ink-900"
                    >
                        <span class="flex size-16 items-center justify-center rounded-full bg-brand-500/90 text-ink transition group-hover:scale-110">
                            <svg class="ml-0.5 size-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left">
                            <span class="font-condensed text-[0.65rem] font-semibold uppercase tracking-wider text-brand-300">{{ $item->category }}</span>
                            <p class="text-sm text-white">{{ $item->caption }}</p>
                        </div>
                    </button>
                @endforeach
            </div>
        @endif
    </section>

    {{-- Lightbox --}}
    <div id="lightbox" class="fixed inset-0 z-50 hidden items-center justify-center bg-ink/90 p-4 backdrop-blur-sm">
        <button type="button" data-lightbox-close class="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10" aria-label="Close">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="w-full max-w-4xl">
            <div id="lightbox-content" class="overflow-hidden rounded-2xl border border-white/10"></div>
            <p id="lightbox-caption" class="mt-3 text-center text-sm text-mist-dim"></p>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    (function () {
        // Category filtering
        var group = document.querySelector('[data-filter-group]');
        var grid = document.querySelector('[data-grid]');
        if (group && grid) {
            group.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-filter]');
                if (!btn) return;
                group.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var filter = btn.getAttribute('data-filter');
                grid.querySelectorAll('[data-category]').forEach(function (item) {
                    var show = !filter || item.getAttribute('data-category') === filter;
                    item.classList.toggle('hidden', !show);
                });
            });
        }

        // Lightbox
        var lightbox = document.getElementById('lightbox');
        var content = document.getElementById('lightbox-content');
        var caption = document.getElementById('lightbox-caption');

        function open(html, text) {
            content.innerHTML = html;
            caption.textContent = text || '';
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
        function close() {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            content.innerHTML = '';
            document.body.style.overflow = '';
        }

        document.querySelectorAll('[data-lightbox-image]').forEach(function (el) {
            el.addEventListener('click', function () {
                open('<img src="' + el.getAttribute('data-lightbox-image') + '" alt="" class="w-full max-h-[80vh] object-contain">', el.getAttribute('data-caption'));
            });
        });
        document.querySelectorAll('[data-lightbox-video]').forEach(function (el) {
            el.addEventListener('click', function () {
                var url = el.getAttribute('data-lightbox-video');
                open('<div class="aspect-video"><iframe src="' + url + '" allow="autoplay; fullscreen" allowfullscreen class="size-full"></iframe></div>', el.getAttribute('data-caption'));
            });
        });

        if (lightbox) {
            lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox || e.target.closest('[data-lightbox-close]')) { close(); }
            });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        }
    })();
</script>
@endpush
