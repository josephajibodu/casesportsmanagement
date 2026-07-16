<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use App\Models\Talent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MediaItemController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->string('type')->toString();

        $items = MediaItem::query()
            ->with('talent:id,full_name')
            ->when(in_array($type, MediaItem::TYPES, true), fn ($q) => $q->where('media_type', $type))
            ->ordered()
            ->get()
            ->map(fn (MediaItem $m) => [
                'id' => $m->id,
                'media_type' => $m->media_type,
                'category' => $m->category,
                'caption' => $m->caption,
                'image_url' => media_url($m->image_path),
                'video_url' => $m->video_url,
                'talent' => $m->talent?->full_name,
                'sort_order' => $m->sort_order,
            ]);

        return Inertia::render('admin/media/index', [
            'items' => $items,
            'filters' => ['type' => $type],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/media/form', [
            'item' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $item = new MediaItem;
        $this->fill($item, $request);
        $item->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media item added.']);

        return to_route('admin.media.index');
    }

    public function edit(MediaItem $mediaItem): Response
    {
        return Inertia::render('admin/media/form', [
            'item' => [
                'id' => $mediaItem->id,
                'media_type' => $mediaItem->media_type,
                'category' => $mediaItem->category,
                'caption' => $mediaItem->caption,
                'video_url' => $mediaItem->video_url,
                'talent_id' => $mediaItem->talent_id,
                'sort_order' => $mediaItem->sort_order,
                'image_path' => $mediaItem->image_path,
                'image_url' => media_url($mediaItem->image_path),
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(Request $request, MediaItem $mediaItem): RedirectResponse
    {
        $this->fill($mediaItem, $request);
        $mediaItem->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media item updated.']);

        return to_route('admin.media.index');
    }

    public function destroy(MediaItem $mediaItem): RedirectResponse
    {
        // The underlying file stays in the File Manager library.
        $mediaItem->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media item deleted.']);

        return to_route('admin.media.index');
    }

    protected function fill(MediaItem $item, Request $request): void
    {
        $data = $request->validate([
            'media_type' => ['required', Rule::in(MediaItem::TYPES)],
            'category' => ['nullable', 'string', 'max:120'],
            'caption' => ['nullable', 'string', 'max:255'],
            'talent_id' => ['nullable', 'exists:talents,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'video_url' => ['nullable', 'url', 'max:500', 'required_if:media_type,video'],
            // Picked in the File Manager: a storage path, required for images.
            'image_path' => ['nullable', 'string', 'max:500', 'required_if:media_type,image'],
        ]);

        if ($data['media_type'] === 'image') {
            $item->image_path = $data['image_path'];
            $item->video_url = null;
        } else {
            $item->image_path = null;
            $item->video_url = $data['video_url'] ?? null;
        }

        $item->fill([
            'media_type' => $data['media_type'],
            'category' => $data['category'] ?? null,
            'caption' => $data['caption'] ?? null,
            'talent_id' => $data['talent_id'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function options(): array
    {
        return [
            'types' => MediaItem::TYPES,
            'imageCategories' => MediaItem::IMAGE_CATEGORIES,
            'videoCategories' => MediaItem::VIDEO_CATEGORIES,
            'talents' => Talent::query()->orderBy('full_name')->get(['id', 'full_name'])
                ->map(fn ($t) => ['id' => $t->id, 'name' => $t->full_name]),
        ];
    }
}
