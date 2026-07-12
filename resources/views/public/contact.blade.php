@extends('layouts.public')

@section('title', 'Contact')
@section('meta_description', 'Get in touch with ' . $settings->agency_name . ' — for players, clubs, press, and partnership enquiries.')

@section('content')
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-24">
            <x-section-heading eyebrow="Get in touch" title="Start the conversation" intro="Whether you're a player, club, or partner — we'd love to hear from you." />
        </div>
    </section>

    <section class="section section-light">
        <div class="shell grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        {{-- Form --}}
        <div>
            @if (session('success'))
                <div class="mb-8 rounded-2xl border border-brand-400/30 bg-brand-500/10 px-6 py-5 text-brand-800" role="status">
                    {{ session('success') }}
                </div>
            @endif

            <form method="POST" action="{{ route('contact.store') }}" class="space-y-5">
                @csrf

                {{-- Honeypot: hidden from users, tempting to bots --}}
                <div class="hidden" aria-hidden="true">
                    <label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label for="name" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Name <span class="text-gold-400">*</span></label>
                        <input id="name" name="name" type="text" required value="{{ old('name') }}" class="field field-light">
                        @error('name')<p class="mt-1.5 text-xs text-red-600">{{ $message }}</p>@enderror
                    </div>
                    <div>
                        <label for="email" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Email <span class="text-gold-400">*</span></label>
                        <input id="email" name="email" type="email" required value="{{ old('email') }}" class="field field-light">
                        @error('email')<p class="mt-1.5 text-xs text-red-600">{{ $message }}</p>@enderror
                    </div>
                    <div>
                        <label for="phone" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Phone</label>
                        <input id="phone" name="phone" type="tel" value="{{ old('phone') }}" class="field field-light">
                        @error('phone')<p class="mt-1.5 text-xs text-red-600">{{ $message }}</p>@enderror
                    </div>
                    <div>
                        <label for="subject" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Subject</label>
                        <input id="subject" name="subject" type="text" value="{{ old('subject') }}" class="field field-light">
                        @error('subject')<p class="mt-1.5 text-xs text-red-600">{{ $message }}</p>@enderror
                    </div>
                </div>

                <div>
                    <label for="message" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Message <span class="text-gold-400">*</span></label>
                    <textarea id="message" name="message" rows="6" required class="field field-light">{{ old('message') }}</textarea>
                    @error('message')<p class="mt-1.5 text-xs text-red-600">{{ $message }}</p>@enderror
                </div>

                <button type="submit" class="btn btn-gold">Send message</button>
            </form>
        </div>

        {{-- Contact details --}}
        <aside class="space-y-4">
            @if ($settings->email)
                <a href="mailto:{{ $settings->email }}" class="card-light flex items-center gap-4 p-5 transition hover:border-slate-300">
                    <span class="flex size-11 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                    </span>
                    <span>
                        <span class="block font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Email</span>
                        <span class="text-sm text-slate-900">{{ $settings->email }}</span>
                    </span>
                </a>
            @endif
            @if ($settings->phone)
                <a href="tel:{{ preg_replace('/\s+/', '', $settings->phone) }}" class="card-light flex items-center gap-4 p-5 transition hover:border-slate-300">
                    <span class="flex size-11 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
                    </span>
                    <span>
                        <span class="block font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Phone</span>
                        <span class="text-sm text-slate-900">{{ $settings->phone }}</span>
                    </span>
                </a>
            @endif
            @if ($settings->address)
                <div class="card-light flex items-center gap-4 p-5">
                    <span class="flex size-11 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <span>
                        <span class="block font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Office</span>
                        <span class="text-sm text-slate-900">{!! nl2br(e($settings->address)) !!}</span>
                    </span>
                </div>
            @endif

            @php $socials = array_filter($settings->social_links ?? []); @endphp
            @if (! empty($socials))
                <div class="card-light p-5">
                    <span class="block font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Follow us</span>
                    <div class="mt-3 flex flex-wrap gap-2">
                        @foreach ($socials as $key => $url)
                            <a href="{{ $url }}" target="_blank" rel="noopener noreferrer" class="rounded-full border border-slate-300 px-4 py-1.5 text-xs text-slate-600 transition hover:border-brand-400 hover:text-slate-900">{{ ucfirst($key) }}</a>
                        @endforeach
                    </div>
                </div>
            @endif
        </aside>
        </div>
    </section>
@endsection
