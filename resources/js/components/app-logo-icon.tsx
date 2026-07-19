import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt="CaSe Sports Management"
            width={209}
            height={172}
            decoding="async"
            {...props}
        />
    );
}
