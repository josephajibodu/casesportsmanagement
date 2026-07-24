import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

const AVATAR_COLORS = [
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
];

/** Deterministic background/text color pair for a name-based avatar fallback. */
export function avatarColor(seed: string): string {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
