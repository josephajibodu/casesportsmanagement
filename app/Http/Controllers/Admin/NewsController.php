<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsArticleRequest;
use App\Models\NewsArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $articles = NewsArticle::query()
            ->when(filled($search), fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->latest('published_at')
            ->latest('id')
            ->get()
            ->map(fn (NewsArticle $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'category' => $a->category,
                'status' => $a->status,
                'published_at' => $a->published_at?->toDateString(),
                'image_url' => media_url($a->featured_image),
                'public_url' => route('news.show', $a),
            ]);

        return Inertia::render('admin/news/index', [
            'articles' => $articles,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/form', [
            'article' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(NewsArticleRequest $request): RedirectResponse
    {
        $article = new NewsArticle;
        $this->fill($article, $request);
        $article->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Article created.']);

        return to_route('admin.news.index');
    }

    public function edit(NewsArticle $news): Response
    {
        return Inertia::render('admin/news/form', [
            'article' => [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'excerpt' => $news->excerpt,
                'body' => $news->body,
                'category' => $news->category,
                'status' => $news->status,
                'published_at' => $news->published_at?->format('Y-m-d\TH:i'),
                'meta_title' => $news->meta_title,
                'meta_description' => $news->meta_description,
                'featured_image' => $news->featured_image,
                'image_url' => media_url($news->featured_image),
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(NewsArticleRequest $request, NewsArticle $news): RedirectResponse
    {
        $this->fill($news, $request);
        $news->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Article updated.']);

        return to_route('admin.news.index');
    }

    public function destroy(NewsArticle $news): RedirectResponse
    {
        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Article deleted.']);

        return to_route('admin.news.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:news_articles,id'],
        ])['ids'];

        $count = NewsArticle::whereIn('id', $ids)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => $count === 1 ? 'Article deleted.' : "{$count} articles deleted."]);

        return to_route('admin.news.index');
    }

    protected function fill(NewsArticle $article, NewsArticleRequest $request): void
    {
        $data = $request->safe()->all();

        // Auto-set a publish date when publishing without one.
        if ($data['status'] === 'published' && blank($data['published_at'] ?? null)) {
            $data['published_at'] = now();
        }

        $article->fill($data);
    }

    /**
     * @return array<string, mixed>
     */
    protected function options(): array
    {
        return [
            'categories' => NewsArticle::CATEGORIES,
            'statuses' => NewsArticle::STATUSES,
        ];
    }
}
