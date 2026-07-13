@extends('layouts.public')

@section('title', 'About Us')
@section('meta_description', 'Learn about ' . $settings->agency_name . ', a FIFA-licensed football agency representing players and coaches worldwide.')

@section('content')
    {{-- ============================ INTRO ============================ --}}
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-28">
            <x-section-heading
                eyebrow="Who we are"
                title="Built on trust. Driven by ambition."
                :intro="$settings->tagline"
            />
        </div>
    </section>

    {{-- ============================ STORY ============================ --}}
    <section class="section section-light">
        <div class="shell grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div class="prose-light max-w-none">
                @foreach (preg_split('/\n\s*\n/', trim($settings->agency_story ?? '')) as $paragraph)
                    <p>{{ $paragraph }}</p>
                @endforeach
            </div>

            <div class="space-y-4">
                @if ($settings->mission)
                    <div class="card-light p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Our Mission</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ $settings->mission }}</p>
                    </div>
                @endif
                @if ($settings->vision)
                    <div class="card-light p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-gold-700">Our Vision</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ $settings->vision }}</p>
                    </div>
                @endif
                @if ($settings->fifa_license_info)
                    <div class="rounded-2xl border border-gold-500/30 bg-gold-400/10 p-6">
                        <h3 class="font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-gold-700">FIFA Licensed</h3>
                        <p class="mt-3 text-sm leading-relaxed text-slate-700">{{ $settings->fifa_license_info }}</p>
                    </div>
                @endif
            </div>
        </div>
    </section>

    {{-- ============================ TEAM ============================ --}}
    @if ($teamMembers->isNotEmpty())
        @php
            $teamData = $teamMembers->map(fn ($m) => [
                'name' => $m->full_name,
                'title' => $m->title,
                'photo' => media_url($m->photo),
                'paragraphs' => array_values(array_filter(preg_split('/\n\s*\n/', trim($m->bio ?? '')))),
            ])->values();
        @endphp

        <div
            x-data="{
                open: false,
                member: { name: '', title: '', photo: '', paragraphs: [] },
                members: @js($teamData),
                show(i) { this.member = this.members[i]; this.open = true; document.body.style.overflow = 'hidden'; },
                close() { this.open = false; document.body.style.overflow = ''; },
            }"
            x-on:keydown.escape.window="close()"
        >
            <section class="section border-t border-white/10 bg-ink-950">
                <div class="shell">
                    <x-section-heading eyebrow="The team" title="Experience you can trust" gold />
                    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        @foreach ($teamMembers as $member)
                            @php
                                $photo = media_url($member->photo);
                                $initials = collect(explode(' ', $member->full_name))->take(2)->map(fn ($p) => \Illuminate\Support\Str::substr($p, 0, 1))->implode('');
                                $paragraphs = array_filter(preg_split('/\n\s*\n/', trim($member->bio ?? '')));
                            @endphp
                            <div class="surface flex flex-col overflow-hidden">
                                <div class="relative aspect-4/5 overflow-hidden">
                                    @if ($photo)
                                        <img src="{{ $photo }}" alt="{{ $member->full_name }}" loading="lazy" class="size-full object-cover">
                                    @else
                                        <div class="flex size-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                                            <span class="font-serif text-5xl font-semibold text-white/25">{{ $initials }}</span>
                                        </div>
                                    @endif
                                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5">
                                        <h3 class="font-serif text-xl font-semibold text-white">{{ $member->full_name }}</h3>
                                        @if ($member->title)
                                            <p class="mt-0.5 font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">{{ $member->title }}</p>
                                        @endif
                                    </div>
                                </div>
                                @if (! empty($paragraphs))
                                    <div class="flex flex-1 flex-col p-5">
                                        <p class="line-clamp-3 text-sm leading-relaxed text-mist-dim">{{ $paragraphs[0] }}</p>
                                        <button
                                            type="button"
                                            x-on:click="show({{ $loop->index }})"
                                            class="mt-4 inline-flex w-fit items-center gap-1.5 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 transition hover:text-gold-300"
                                        >
                                            Read more
                                            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                                        </button>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            </section>

            {{-- Team member modal (fixed size, smooth transitions via Alpine) --}}
            <div
                x-cloak
                x-show="open"
                x-transition:enter="transition ease-out duration-200"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
                x-transition:leave="transition ease-in duration-150"
                x-transition:leave-start="opacity-100"
                x-transition:leave-end="opacity-0"
                x-on:click.self="close()"
                class="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
            >
                <div
                    x-show="open"
                    x-transition:enter="transition ease-out duration-200"
                    x-transition:enter-start="opacity-0 translate-y-4 scale-95"
                    x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                    x-transition:leave="transition ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                    x-transition:leave-end="opacity-0 translate-y-4 scale-95"
                    class="relative flex h-[560px] max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-2xl"
                >
                    <button type="button" x-on:click="close()" class="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10" aria-label="Close">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
                    </button>

                    <div class="flex items-center gap-4 border-b border-white/10 p-6 pr-16 sm:p-8 sm:pr-16">
                        <img x-bind:src="member.photo" x-bind:alt="member.name" class="size-20 shrink-0 rounded-2xl object-cover">
                        <div>
                            <h3 x-text="member.name" class="font-serif text-2xl font-semibold text-white"></h3>
                            <p x-text="member.title" class="mt-1 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-gold-400"></p>
                        </div>
                    </div>

                    <div class="prose-dark flex-1 overflow-y-auto p-6 sm:p-8">
                        <template x-for="(paragraph, index) in member.paragraphs" x-bind:key="index">
                            <p x-text="paragraph"></p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    @endif

    @include('public.partials.contact-cta')
@endsection
