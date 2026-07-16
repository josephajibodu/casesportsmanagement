<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/team/index', [
            'members' => TeamMember::query()->ordered()->get()->map(fn (TeamMember $m) => [
                'id' => $m->id,
                'full_name' => $m->full_name,
                'title' => $m->title,
                'sort_order' => $m->sort_order,
                'photo_url' => media_url($m->photo),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/team/form', ['member' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $member = new TeamMember;
        $this->fill($member, $request);
        $member->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Team member added.']);

        return to_route('admin.team.index');
    }

    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('admin/team/form', [
            'member' => [
                'id' => $teamMember->id,
                'full_name' => $teamMember->full_name,
                'title' => $teamMember->title,
                'bio' => $teamMember->bio,
                'sort_order' => $teamMember->sort_order,
                'photo' => $teamMember->photo,
                'photo_url' => media_url($teamMember->photo),
            ],
        ]);
    }

    public function update(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $this->fill($teamMember, $request);
        $teamMember->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Team member updated.']);

        return to_route('admin.team.index');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Team member deleted.']);

        return to_route('admin.team.index');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => ['array'], 'ids.*' => ['integer']]);

        foreach ($request->input('ids', []) as $order => $id) {
            TeamMember::whereKey($id)->update(['sort_order' => $order]);
        }

        return back();
    }

    protected function fill(TeamMember $member, Request $request): void
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:160'],
            'title' => ['nullable', 'string', 'max:120'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'photo' => ['nullable', 'string', 'max:500'],
        ]);

        $member->fill($data);
    }
}
