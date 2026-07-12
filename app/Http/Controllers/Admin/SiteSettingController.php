<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::current();

        return Inertia::render('admin/settings/site', [
            'settings' => [
                'agency_name' => $settings->agency_name,
                'tagline' => $settings->tagline,
                'agency_story' => $settings->agency_story,
                'mission' => $settings->mission,
                'vision' => $settings->vision,
                'fifa_license_info' => $settings->fifa_license_info,
                'email' => $settings->email,
                'phone' => $settings->phone,
                'address' => $settings->address,
                'services' => $settings->services ?? [],
                'stats' => $settings->stats ?? [],
                'social_links' => $settings->social_links ?? [],
            ],
            'socialKeys' => ['instagram', 'twitter', 'facebook', 'linkedin'],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'agency_name' => ['required', 'string', 'max:160'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'agency_story' => ['nullable', 'string', 'max:10000'],
            'mission' => ['nullable', 'string', 'max:2000'],
            'vision' => ['nullable', 'string', 'max:2000'],
            'fifa_license_info' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:60'],
            'address' => ['nullable', 'string', 'max:500'],

            'services' => ['nullable', 'array'],
            'services.*.group' => ['nullable', 'string', 'max:80'],
            'services.*.title' => ['nullable', 'string', 'max:120'],
            'services.*.description' => ['nullable', 'string', 'max:400'],

            'stats' => ['nullable', 'array'],
            'stats.*.value' => ['nullable', 'string', 'max:40'],
            'stats.*.label' => ['nullable', 'string', 'max:80'],

            'social_links' => ['nullable', 'array'],
            'social_links.*' => ['nullable', 'string', 'max:255'],
        ]);

        $data['services'] = collect($data['services'] ?? [])
            ->filter(fn ($r) => filled($r['title'] ?? null))
            ->map(fn ($r) => [
                'group' => (string) ($r['group'] ?? ''),
                'title' => (string) ($r['title'] ?? ''),
                'description' => (string) ($r['description'] ?? ''),
            ])->values()->all();

        $data['stats'] = collect($data['stats'] ?? [])
            ->filter(fn ($r) => filled($r['value'] ?? null) || filled($r['label'] ?? null))
            ->map(fn ($r) => ['value' => (string) ($r['value'] ?? ''), 'label' => (string) ($r['label'] ?? '')])
            ->values()->all();

        $data['social_links'] = collect($data['social_links'] ?? [])->filter()->all();

        SiteSetting::current()->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Settings saved.']);

        return to_route('admin.site-settings.edit');
    }
}
