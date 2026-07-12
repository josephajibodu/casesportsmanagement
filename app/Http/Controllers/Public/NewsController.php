<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request): View
    {
        $category = $request->string('category')->toString();

        $query = NewsArticle::query()->published()->latest('published_at');

        if (in_array($category, NewsArticle::CATEGORIES, true)) {
            $query->where('category', $category);
        }

        return view('public.news.index', [
            'articles' => $query->paginate(9)->withQueryString(),
            'categories' => NewsArticle::CATEGORIES,
            'activeCategory' => $category,
        ]);
    }

    public function show(NewsArticle $article): View
    {
        abort_unless(
            $article->status === 'published'
                && $article->published_at !== null
                && $article->published_at->isPast(),
            404
        );

        $related = NewsArticle::query()
            ->published()
            ->whereKeyNot($article->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('public.news.show', [
            'article' => $article,
            'related' => $related,
        ]);
    }
}
