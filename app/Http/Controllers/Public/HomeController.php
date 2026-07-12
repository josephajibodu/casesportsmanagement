<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Partner;
use App\Models\Talent;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    public function __invoke(): View
    {
        return view('public.home', [
            'featuredTalents' => Talent::query()->published()->featured()->ordered()->take(6)->get(),
            'latestNews' => NewsArticle::query()->published()->latest('published_at')->take(3)->get(),
            'partners' => Partner::query()->ordered()->get(),
            'galleryItems' => MediaItem::query()->images()->ordered()->take(8)->get(),
        ]);
    }
}
