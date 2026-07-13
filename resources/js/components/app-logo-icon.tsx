import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bm-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0f1c30" />
                    <stop offset="1" stopColor="#0a1322" />
                </linearGradient>
                <linearGradient id="bm-stroke" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" />
                    <stop offset="1" stopColor="#d4af37" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#bm-grad)" stroke="url(#bm-stroke)" strokeWidth="1.5" />
            <path d="M30 17a9 9 0 1 0 0 14" stroke="#34d399" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <circle cx="31.5" cy="24" r="2.6" fill="#d4af37" />
        </svg>
    );
}
