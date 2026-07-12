@props([
    'eyebrow' => null,
    'title' => null,
    'intro' => null,
    'align' => 'left',
    'gold' => false,
    'light' => false,
])

<div @class([
    'max-w-2xl',
    'mx-auto text-center' => $align === 'center',
])>
    @if ($eyebrow)
        <p @class([
            'eyebrow',
            'eyebrow-gold' => $gold && ! $light,
            'text-gold-700' => $gold && $light,
            'text-brand-600' => ! $gold && $light,
            'justify-center' => $align === 'center',
        ])>
            <span class="inline-block h-px w-6 bg-current opacity-60"></span>
            {{ $eyebrow }}
        </p>
    @endif

    @if ($title)
        <h2 @class([
            'mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]',
            'text-slate-900' => $light,
        ])>
            {{ $title }}
        </h2>
    @endif

    @if ($intro)
        <p @class([
            'mt-4 text-base leading-relaxed sm:text-lg',
            'text-slate-600' => $light,
            'text-mist-dim' => ! $light,
        ])>
            {{ $intro }}
        </p>
    @endif

    {{ $slot }}
</div>
