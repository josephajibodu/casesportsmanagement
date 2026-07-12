<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function __invoke(Request $request): View
    {
        $tab = $request->string('tab')->toString() === 'video' ? 'video' : 'image';

        $items = MediaItem::query()
            ->where('media_type', $tab)
            ->ordered()
            ->get();

        $categories = $tab === 'video'
            ? MediaItem::VIDEO_CATEGORIES
            : MediaItem::IMAGE_CATEGORIES;

        return view('public.gallery', [
            'items' => $items,
            'tab' => $tab,
            'categories' => $categories,
        ]);
    }
}
