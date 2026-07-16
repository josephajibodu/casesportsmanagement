@extends('layouts.public')

@section('title', 'Protected file')

@section('content')
    <section class="section shell flex min-h-[70vh] items-center justify-center">
        <div class="surface w-full max-w-md p-8 text-center">
            <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" />
                </svg>
            </span>

            <h1 class="mt-5 font-serif text-2xl font-semibold text-white">This file is password protected</h1>
            <p class="mt-2 text-sm text-mist-dim">Enter the password you were given to view {{ $file->name }}.</p>

            <form method="POST" action="{{ route('shared-file.unlock', $token) }}" class="mt-6 space-y-4 text-left">
                @csrf
                <div>
                    <label for="password" class="mb-1.5 block font-condensed text-xs font-semibold uppercase tracking-[0.15em] text-mist-faint">Password</label>
                    <input id="password" name="password" type="password" required autofocus class="field">
                    @error('password')<p class="mt-1.5 text-xs text-red-400">{{ $message }}</p>@enderror
                </div>
                <button type="submit" class="btn btn-primary w-full">View file</button>
            </form>
        </div>
    </section>
@endsection
