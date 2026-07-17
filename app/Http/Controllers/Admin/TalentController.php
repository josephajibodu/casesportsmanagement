<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TalentRequest;
use App\Models\Talent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TalentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $type = $request->string('type')->toString();

        $talents = Talent::query()
            ->when(filled($search), fn ($q) => $q->where('full_name', 'like', "%{$search}%"))
            ->when(in_array($type, Talent::TYPES, true), fn ($q) => $q->where('type', $type))
            ->ordered()
            ->get()
            ->map(fn (Talent $t) => [
                'id' => $t->id,
                'full_name' => $t->full_name,
                'type' => $t->type,
                'position' => $t->position,
                'nationality' => $t->nationality,
                'photo_url' => media_url($t->photo),
                'is_featured' => $t->is_featured,
                'status' => $t->status,
            ]);

        return Inertia::render('admin/talents/index', [
            'talents' => $talents,
            'filters' => ['search' => $search, 'type' => $type],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/talents/form', [
            'talent' => null,
            'options' => $this->options(),
        ]);
    }

    public function store(TalentRequest $request): RedirectResponse
    {
        $talent = new Talent;
        $this->fill($talent, $request);
        $talent->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile created.']);

        return to_route('admin.talents.index');
    }

    public function edit(Talent $talent): Response
    {
        return Inertia::render('admin/talents/form', [
            'talent' => [
                'id' => $talent->id,
                'type' => $talent->type,
                'full_name' => $talent->full_name,
                'slug' => $talent->slug,
                'position' => $talent->position,
                'shirt_number' => $talent->shirt_number,
                'secondary_positions' => $talent->secondary_positions ?? [],
                'nationality' => $talent->nationality,
                'secondary_nationality' => $talent->secondary_nationality,
                'date_of_birth' => $talent->date_of_birth?->format('Y-m-d'),
                'place_of_birth' => $talent->place_of_birth,
                'height_cm' => $talent->height_cm,
                'weight_kg' => $talent->weight_kg,
                'preferred_foot' => $talent->preferred_foot,
                'current_club' => $talent->current_club,
                'contract_status' => $talent->contract_status,
                'contract_until' => $talent->contract_until?->format('Y-m-d'),
                'market_value' => $talent->market_value,
                'biography' => $talent->biography,
                'career_history' => $talent->career_history ?? [],
                'video_links' => $talent->video_links ?? [],
                'videos' => collect($talent->video_files ?? [])->map(fn ($p) => ['path' => $p, 'url' => media_url($p)])->values(),
                'gallery' => collect($talent->gallery_images ?? [])->map(fn ($p) => ['path' => $p, 'url' => media_url($p)])->values(),
                'is_featured' => $talent->is_featured,
                'status' => $talent->status,
                'sort_order' => $talent->sort_order,
                'meta_title' => $talent->meta_title,
                'meta_description' => $talent->meta_description,
                'photo' => $talent->photo,
                'photo_url' => media_url($talent->photo),
            ],
            'options' => $this->options(),
        ]);
    }

    public function update(TalentRequest $request, Talent $talent): RedirectResponse
    {
        $this->fill($talent, $request);
        $talent->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile updated.']);

        return to_route('admin.talents.index');
    }

    public function destroy(Talent $talent): RedirectResponse
    {
        // Media lives in the File Manager library and may be reused elsewhere,
        // so deleting a profile never removes the underlying files.
        $talent->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile deleted.']);

        return to_route('admin.talents.index');
    }

    public function toggleFeatured(Talent $talent): RedirectResponse
    {
        $talent->update(['is_featured' => ! $talent->is_featured]);

        Inertia::flash('toast', ['type' => 'success', 'message' => $talent->is_featured ? 'Marked as featured.' : 'Removed from featured.']);

        return back();
    }

    protected function fill(Talent $talent, TalentRequest $request): void
    {
        $data = $request->safe()->all();

        $data['career_history'] = $this->cleanRows($request->input('career_history'), ['club', 'years']);
        $data['video_links'] = $this->cleanRows($request->input('video_links'), ['label', 'url']);
        $data['gallery_images'] = array_values(array_filter($request->input('gallery_images', [])));
        $data['video_files'] = array_values(array_filter($request->input('video_files', [])));
        $data['secondary_positions'] = array_values(array_filter(
            array_map('trim', $request->input('secondary_positions', [])),
            fn ($value) => $value !== '',
        ));

        $talent->fill($data);
    }

    /**
     * Drop repeater rows where every relevant field is empty.
     *
     * @param  array<string>  $keys
     * @return array<int, array<string, string>>
     */
    protected function cleanRows(mixed $rows, array $keys): array
    {
        return collect(is_array($rows) ? $rows : [])
            ->filter(fn ($row) => collect($keys)->contains(fn ($k) => filled($row[$k] ?? null)))
            ->map(fn ($row) => collect($keys)->mapWithKeys(fn ($k) => [$k => (string) ($row[$k] ?? '')])->all())
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function options(): array
    {
        return [
            'types' => Talent::TYPES,
            'statuses' => Talent::STATUSES,
            'feet' => Talent::PREFERRED_FEET,
            'contractStatuses' => Talent::CONTRACT_STATUSES,
        ];
    }
}
