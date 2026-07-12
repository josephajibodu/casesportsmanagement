<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Contracts\View\View;

class PartnerController extends Controller
{
    public function __invoke(): View
    {
        return view('public.partners', [
            'partners' => Partner::query()->ordered()->get(),
        ]);
    }
}
