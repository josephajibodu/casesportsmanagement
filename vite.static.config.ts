import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/static.css'],
            buildDirectory: 'build-static',
            refresh: [
                'resources/views/**',
                'routes/**',
            ],
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600, 700],
                    variable: '--font-sans-family',
                }),
                bunny('Fraunces', {
                    weights: [400, 500, 600, 700, 900],
                    styles: ['normal', 'italic'],
                    variable: '--font-serif-family',
                }),
                bunny('Oswald', {
                    weights: [500, 600, 700],
                    variable: '--font-condensed-family',
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        port: 5174,
    },
});
