<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Models\Talent;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = [
            ['loc' => route('home'), 'priority' => '1.0'],
            ['loc' => route('about'), 'priority' => '0.7'],
            ['loc' => route('players.index'), 'priority' => '0.9'],
            ['loc' => route('coaches.index'), 'priority' => '0.8'],
            ['loc' => route('news.index'), 'priority' => '0.8'],
            ['loc' => route('gallery'), 'priority' => '0.6'],
            ['loc' => route('partners'), 'priority' => '0.5'],
            ['loc' => route('contact'), 'priority' => '0.7'],
        ];

        foreach (Talent::query()->published()->get() as $talent) {
            $urls[] = [
                'loc' => $talent->publicUrl(),
                'lastmod' => $talent->updated_at?->toAtomString(),
                'priority' => '0.7',
            ];
        }

        foreach (NewsArticle::query()->published()->get() as $article) {
            $urls[] = [
                'loc' => route('news.show', $article),
                'lastmod' => $article->updated_at?->toAtomString(),
                'priority' => '0.6',
            ];
        }

        return response()
            ->view('public.sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }
}
