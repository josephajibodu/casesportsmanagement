@extends('layouts.public')

@section('title', 'Partners')
@section('meta_description', 'The partners and organisations that support ' . $settings->agency_name . '.')

@section('content')
    <section class="relative overflow-hidden border-b border-white/10">
        <div class="pitch-grid pointer-events-none absolute inset-0"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]"></div>
        <div class="shell relative py-20 sm:py-24">
            <x-section-heading eyebrow="Trusted by" title="Our partners" intro="The organisations that support our players and the agency." />
        </div>
    </section>

    <section class="section section-light">
        <div class="shell">
            @if ($partners->isEmpty())
                <div class="card-light py-20 text-center">
                    <p class="text-slate-500">Partner information coming soon.</p>
                </div>
            @else
                <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($partners as $partner)
                        @php $logo = media_url($partner->logo); @endphp
                        <div class="card-light flex flex-col items-center p-8 text-center">
                            <div class="flex h-20 items-center justify-center">
                                @if ($logo)
                                    <img src="{{ $logo }}" alt="{{ $partner->name }}" loading="lazy" class="max-h-16 max-w-[12rem] object-contain">
                                @else
                                    <span class="font-condensed text-2xl font-bold uppercase tracking-wider text-slate-700">{{ $partner->name }}</span>
                                @endif
                            </div>
                            @if ($partner->description)
                                <p class="mt-4 text-sm leading-relaxed text-slate-600">{{ $partner->description }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    @include('public.partials.contact-cta')
@endsection
