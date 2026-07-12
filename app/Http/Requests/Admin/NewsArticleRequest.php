<?php

namespace App\Http\Requests\Admin;

use App\Models\NewsArticle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $articleId = $this->route('news')?->id;

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:220', Rule::unique('news_articles', 'slug')->ignore($articleId)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string', 'max:50000'],
            'category' => ['nullable', Rule::in(NewsArticle::CATEGORIES)],
            'status' => ['required', Rule::in(NewsArticle::STATUSES)],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:300'],
            'featured_image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
