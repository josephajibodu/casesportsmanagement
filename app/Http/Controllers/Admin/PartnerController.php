<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    use HandlesUploads;

    public function index(): Response
    {
        return Inertia::render('admin/partners/index', [
            'partners' => Partner::query()->ordered()->get()->map(fn (Partner $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'sort_order' => $p->sort_order,
                'logo_url' => media_url($p->logo),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/partners/form', ['partner' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $partner = new Partner;
        $this->fill($partner, $request);
        $partner->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Partner added.']);

        return to_route('admin.partners.index');
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('admin/partners/form', [
            'partner' => [
                'id' => $partner->id,
                'name' => $partner->name,
                'description' => $partner->description,
                'sort_order' => $partner->sort_order,
                'logo_url' => media_url($partner->logo),
            ],
        ]);
    }

    public function update(Request $request, Partner $partner): RedirectResponse
    {
        $this->fill($partner, $request);
        $partner->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Partner updated.']);

        return to_route('admin.partners.index');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        $this->deleteUpload($partner->logo);
        $partner->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Partner deleted.']);

        return to_route('admin.partners.index');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => ['array'], 'ids.*' => ['integer']]);

        foreach ($request->input('ids', []) as $order => $id) {
            Partner::whereKey($id)->update(['sort_order' => $order]);
        }

        return back();
    }

    protected function fill(Partner $partner, Request $request): void
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'logo' => ['nullable', 'image', 'max:5120'],
        ]);

        $data['logo'] = $this->storeUpload($request->file('logo'), 'partners', $partner->logo);
        $partner->fill($data);
    }
}
