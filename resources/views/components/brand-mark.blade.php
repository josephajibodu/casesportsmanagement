@props(['class' => 'h-9 w-9'])

<svg {{ $attributes->merge(['class' => $class]) }} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <linearGradient id="bm-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0f1c30" />
            <stop offset="1" stop-color="#0a1322" />
        </linearGradient>
        <linearGradient id="bm-stroke" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stop-color="#34d399" />
            <stop offset="1" stop-color="#d4af37" />
        </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#bm-grad)" stroke="url(#bm-stroke)" stroke-width="1.5" />
    {{-- stylised C --}}
    <path d="M30 17a9 9 0 1 0 0 14" stroke="#34d399" stroke-width="3.2" stroke-linecap="round" fill="none" />
    {{-- accent S dot --}}
    <circle cx="31.5" cy="24" r="2.6" fill="#d4af37" />
</svg>
