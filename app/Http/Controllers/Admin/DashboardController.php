<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Partner;
use App\Models\Talent;
use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'talents' => Talent::count(),
                'players' => Talent::where('type', 'player')->count(),
                'coaches' => Talent::where('type', 'coach')->count(),
                'published_talents' => Talent::where('status', 'published')->count(),
                'news' => NewsArticle::count(),
                'published_news' => NewsArticle::where('status', 'published')->count(),
                'team' => TeamMember::count(),
                'partners' => Partner::count(),
                'media' => MediaItem::count(),
                'new_enquiries' => ContactSubmission::where('status', 'new')->count(),
            ],
            'recentEnquiries' => ContactSubmission::latest()->take(5)->get(['id', 'name', 'email', 'subject', 'status', 'created_at']),
        ]);
    }
}
