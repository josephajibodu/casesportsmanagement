@props(['class' => 'h-12 w-auto'])

<img
    src="{{ asset('images/logo.png') }}"
    alt="CaSe Sports Management"
    {{ $attributes->merge(['class' => $class]) }}
    width="209"
    height="172"
    decoding="async"
>
