@props(['class' => 'h-9 w-9'])

<svg {{ $attributes->merge(['class' => $class]) }} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="44" height="44" rx="12" fill="#0f1c30" stroke="#34d399" stroke-width="1.5" />
    {{-- stylised C --}}
    <path d="M30 17a9 9 0 1 0 0 14" stroke="#34d399" stroke-width="3.2" stroke-linecap="round" fill="none" />
    {{-- accent S dot --}}
    <circle cx="31.5" cy="24" r="2.6" fill="#d4af37" />
</svg>
