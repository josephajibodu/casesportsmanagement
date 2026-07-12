<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Contracts\View\View;

class AboutController extends Controller
{
    public function __invoke(): View
    {
        return view('public.about', [
            'teamMembers' => TeamMember::query()->ordered()->get(),
        ]);
    }
}
