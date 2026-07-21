<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/admins/index', [
            'admins' => User::query()->orderBy('name')->get()->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'created_at' => $u->created_at?->format('j M Y'),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/admins/form', ['admin' => null]);
    }

    public function store(AdminUserRequest $request): RedirectResponse
    {
        $password = Str::password(16);

        $admin = User::create([
            ...$request->validated(),
            'password' => $password,
        ]);

        $this->flashGeneratedCredentials($admin, $password);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Admin account created.']);

        return to_route('admin.admins.index');
    }

    public function edit(User $admin): Response
    {
        return Inertia::render('admin/admins/form', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    public function update(AdminUserRequest $request, User $admin): RedirectResponse
    {
        $admin->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Admin updated.']);

        return to_route('admin.admins.index');
    }

    public function destroy(User $admin): RedirectResponse
    {
        $blockedReason = DB::transaction(function () use ($admin) {
            if (User::query()->lockForUpdate()->count() <= 1) {
                return 'last';
            }

            if ($admin->id === auth()->id()) {
                return 'self';
            }

            $admin->delete();

            return null;
        });

        if ($blockedReason === 'last') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'At least one admin account must remain.']);

            return back();
        }

        if ($blockedReason === 'self') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'You cannot delete your own account.']);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Admin removed.']);

        return to_route('admin.admins.index');
    }

    public function resetPassword(User $admin): RedirectResponse
    {
        $password = Str::password(16);

        $admin->update(['password' => $password]);

        $this->flashGeneratedCredentials($admin, $password);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'New password generated.']);

        return back();
    }

    protected function flashGeneratedCredentials(User $admin, string $password): void
    {
        Inertia::flash('generatedAdmin', [
            'name' => $admin->name,
            'email' => $admin->email,
            'password' => $password,
            'login_url' => route('login'),
        ]);
    }
}
