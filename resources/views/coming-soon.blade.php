@extends('layouts.static')

@section('title', 'Coming Soon | CaSe Sports Management')

@section('body_class', 'min-h-screen bg-[#050a12] font-sans text-white antialiased')

@push('meta')
    <meta name="description" content="CaSe Sports Management, a FIFA-licensed football agency representing players and coaches worldwide. Our new website is coming soon.">
@endpush

@section('content')
    <div class="relative flex min-h-screen flex-col overflow-hidden">
        {{-- Background layers --}}
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]"></div>
        <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>
        <div class="pointer-events-none absolute -right-32 top-1/3 size-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -left-32 bottom-1/4 size-80 rounded-full bg-amber-400/10 blur-3xl"></div>

        <main class="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
            <div class="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-300 uppercase">
                <span class="size-1.5 rounded-full bg-emerald-400"></span>
                FIFA-Licensed Football Agency
            </div>

            <div class="max-w-3xl">
                <p class="mb-3 text-sm font-semibold tracking-[0.35em] text-emerald-400 uppercase">
                    CaSe Sports Management
                </p>
                <h1 class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Something great is
                    <span class="bg-linear-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                        coming soon
                    </span>
                </h1>
                <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                    We are building a professional home for our agency, showcasing represented players and coaches,
                    latest news, media, and partnerships. A trusted platform for football representation.
                </p>
            </div>

            <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                @foreach ([
                    ['Players & Coaches', 'Elite talent representation'],
                    ['News & Press', 'Agency updates and announcements'],
                    ['Gallery', 'Events, matches, and media'],
                    ['Partners', 'Collaborations and relationships'],
                ] as [$title, $description])
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                        <h2 class="text-sm font-semibold text-white">{{ $title }}</h2>
                        <p class="mt-2 text-sm leading-relaxed text-slate-400">{{ $description }}</p>
                    </div>
                @endforeach
            </div>

            <div class="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                    href="mailto:info@casesportsmanagement.com"
                    class="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                >
                    Get in touch
                </a>
                <p class="text-sm text-slate-400">
                    Questions? Email
                    <a href="mailto:info@casesportsmanagement.com" class="font-medium text-emerald-300 underline-offset-4 hover:underline">
                        info@casesportsmanagement.com
                    </a>
                </p>
            </div>
        </main>

        <footer class="relative border-t border-white/10 px-6 py-6 sm:px-10">
            <div class="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>&copy; {{ date('Y') }} CaSe Sports Management. All rights reserved.</p>
                <p class="text-slate-600">Professional football representation.</p>
            </div>
        </footer>
    </div>
@endsection
