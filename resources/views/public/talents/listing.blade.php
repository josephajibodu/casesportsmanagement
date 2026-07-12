@extends('layouts.public')

@php
    $isCoach = $type === 'coach';
    $label = $isCoach ? 'Coaches' : 'Players';
    $routeName = $isCoach ? 'coaches.index' : 'players.index';
@endphp

@section('title', $label)
@section('meta_description', 'Meet the ' . strtolower($label) . ' represented by ' . $settings->agency_name . '.')

@section('content')
    {{-- Dark hero band --}}
    <section class="relative overflow-hidden border-b border-white/10 bg-ink">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-24">
            <x-section-heading
                :eyebrow="'Our roster'"
                :title="$isCoach ? 'The coaches we represent' : 'The players we represent'"
                :intro="$isCoach ? 'Experienced coaching staff guided by dedicated representation.' : 'Dedicated representation for players at every level of the game.'"
            />
        </div>
    </section>

    {{-- Light listing --}}
    <section class="section section-light">
        <div class="shell">
            {{-- Filters --}}
            @if ($positions->isNotEmpty() || $nationalities->isNotEmpty())
                <form method="GET" class="mb-10 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
                    <div>
                        <label class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Position</label>
                        <select name="position" onchange="this.form.submit()" class="field field-light">
                            <option value="">All positions</option>
                            @foreach ($positions as $position)
                                <option value="{{ $position }}" @selected($filters['position'] === $position)>{{ $position }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Nationality</label>
                        <select name="nationality" onchange="this.form.submit()" class="field field-light">
                            <option value="">All nationalities</option>
                            @foreach ($nationalities as $nationality)
                                <option value="{{ $nationality }}" @selected($filters['nationality'] === $nationality)>{{ $nationality }}</option>
                            @endforeach
                        </select>
                    </div>
                </form>
            @endif

            @if ($talents->isEmpty())
                <div class="card-light py-20 text-center">
                    <p class="text-slate-500">No {{ strtolower($label) }} match your filters.</p>
                    <a href="{{ route($routeName) }}" class="mt-4 inline-block text-sm font-semibold text-brand-600 underline underline-offset-4">Clear filters</a>
                </div>
            @else
                <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    @foreach ($talents as $talent)
                        <x-talent-card :talent="$talent" />
                    @endforeach
                </div>
            @endif
        </div>
    </section>
@endsection
