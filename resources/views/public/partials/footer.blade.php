@php
    $socials = array_filter($settings->social_links ?? []);
    $socialLabels = ['instagram' => 'Instagram', 'twitter' => 'X', 'facebook' => 'Facebook', 'linkedin' => 'LinkedIn'];
@endphp

<footer class="relative mt-8 border-t border-white/10 bg-ink-950">
    <div class="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
            <a href="{{ route('home') }}" class="inline-flex items-center" aria-label="{{ $settings->agency_name }} home">
                <x-brand-mark class="h-14 w-auto" />
            </a>
            <p class="mt-5 max-w-sm text-sm leading-relaxed text-mist-dim">
                {{ $settings->tagline ?: 'Elite football representation with a personal touch.' }}
            </p>
            @if ($settings->fifa_license_info)
                <p class="eyebrow eyebrow-gold mt-6">{{ $settings->fifa_license_info }}</p>
            @endif
        </div>

        <div>
            <h4 class="font-condensed text-xs font-semibold uppercase tracking-[0.28em] text-mist-faint">Explore</h4>
            <ul class="mt-5 space-y-3 text-sm">
                <li><a href="{{ route('about') }}" class="text-mist-dim transition hover:text-white">About Us</a></li>
                <li><a href="{{ route('players.index') }}" class="text-mist-dim transition hover:text-white">Players</a></li>
                @if (\App\Models\Talent::query()->published()->where('type', 'coach')->exists())
                    <li><a href="{{ route('coaches.index') }}" class="text-mist-dim transition hover:text-white">Coaches</a></li>
                @endif
                <li><a href="{{ route('news.index') }}" class="text-mist-dim transition hover:text-white">News & Press</a></li>
                <li><a href="{{ route('gallery') }}" class="text-mist-dim transition hover:text-white">Gallery</a></li>
                <li><a href="{{ route('partners') }}" class="text-mist-dim transition hover:text-white">Partners</a></li>
            </ul>
        </div>

        <div>
            <h4 class="font-condensed text-xs font-semibold uppercase tracking-[0.28em] text-mist-faint">Get in touch</h4>
            <ul class="mt-5 space-y-3 text-sm">
                @if ($settings->email)
                    <li><a href="mailto:{{ $settings->email }}" class="text-mist-dim transition hover:text-white">{{ $settings->email }}</a></li>
                @endif
                @if ($settings->phone)
                    <li><a href="tel:{{ preg_replace('/\s+/', '', $settings->phone) }}" class="text-mist-dim transition hover:text-white">{{ $settings->phone }}</a></li>
                @endif
                @if (! empty($settings->addressLines()))
                    <li class="text-mist-dim">{!! implode('<br>', array_map('e', $settings->addressLines())) !!}</li>
                @endif
            </ul>

            @if (! empty($socials))
                <div class="mt-6 flex gap-3">
                    @foreach ($socials as $key => $url)
                        <a
                            href="{{ $url }}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-mist-dim transition hover:border-brand-400 hover:text-white"
                            aria-label="{{ $socialLabels[$key] ?? $key }}"
                        >{{ Str::substr($socialLabels[$key] ?? $key, 0, 2) }}</a>
                    @endforeach
                </div>
            @endif
        </div>
    </div>

    <div class="border-t border-white/10">
        <div class="shell flex flex-col gap-2 py-6 text-xs text-mist-faint sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {{ date('Y') }} {{ $settings->agency_name }}. All rights reserved.</p>
            <p>Professional football representation · Global reach · Personal approach</p>
        </div>
    </div>
</footer>
