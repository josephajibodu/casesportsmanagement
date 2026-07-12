<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Talent;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class TalentController extends Controller
{
    public function players(Request $request): View
    {
        return $this->listing($request, 'player');
    }

    public function coaches(Request $request): View
    {
        return $this->listing($request, 'coach');
    }

    public function showPlayer(Talent $talent): View
    {
        return $this->show($talent, 'player');
    }

    public function showCoach(Talent $talent): View
    {
        return $this->show($talent, 'coach');
    }

    protected function listing(Request $request, string $type): View
    {
        $query = Talent::query()->published()->where('type', $type)->ordered();

        $position = $request->string('position')->toString();
        $nationality = $request->string('nationality')->toString();

        if (filled($position)) {
            $query->where('position', $position);
        }

        if (filled($nationality)) {
            $query->where('nationality', $nationality);
        }

        $base = Talent::query()->published()->where('type', $type);

        return view('public.talents.listing', [
            'type' => $type,
            'talents' => $query->get(),
            'positions' => (clone $base)->whereNotNull('position')->distinct()->orderBy('position')->pluck('position'),
            'nationalities' => (clone $base)->whereNotNull('nationality')->distinct()->orderBy('nationality')->pluck('nationality'),
            'filters' => [
                'position' => $position,
                'nationality' => $nationality,
            ],
        ]);
    }

    protected function show(Talent $talent, string $type): View
    {
        abort_unless($talent->status === 'published' && $talent->type === $type, 404);

        $related = Talent::query()
            ->published()
            ->where('type', $type)
            ->whereKeyNot($talent->id)
            ->ordered()
            ->take(3)
            ->get();

        return view('public.talents.show', [
            'talent' => $talent,
            'related' => $related,
        ]);
    }
}
