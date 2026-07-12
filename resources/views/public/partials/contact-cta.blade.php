<section class="section shell">
    <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 px-8 py-16 text-center sm:px-16">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(212,175,55,0.12),transparent)]"></div>
        <div class="relative mx-auto max-w-2xl">
            <h2 class="font-serif text-3xl font-semibold text-white sm:text-4xl">Whether you're a player, club, or partner — let's talk.</h2>
            <p class="mt-4 text-lg text-mist-dim">Reach out and discover how {{ $settings->agency_name }} can support your next move.</p>
            <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href="{{ route('contact') }}" class="btn btn-gold">Get in touch</a>
                @if ($settings->email)
                    <a href="mailto:{{ $settings->email }}" class="btn btn-ghost">{{ $settings->email }}</a>
                @endif
            </div>
        </div>
    </div>
</section>
