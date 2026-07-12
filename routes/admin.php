<?php

use App\Http\Controllers\Admin\ContactSubmissionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaItemController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\TalentController;
use App\Http\Controllers\Admin\TeamMemberController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::patch('talents/{talent}/featured', [TalentController::class, 'toggleFeatured'])->name('talents.featured');
        Route::resource('talents', TalentController::class)->except('show');

        Route::resource('news', NewsController::class)->except('show');

        Route::post('team/reorder', [TeamMemberController::class, 'reorder'])->name('team.reorder');
        Route::resource('team', TeamMemberController::class)->except('show')->parameters(['team' => 'teamMember']);

        Route::post('partners/reorder', [PartnerController::class, 'reorder'])->name('partners.reorder');
        Route::resource('partners', PartnerController::class)->except('show');

        Route::resource('media', MediaItemController::class)->except('show')->parameters(['media' => 'mediaItem']);

        Route::get('enquiries', [ContactSubmissionController::class, 'index'])->name('enquiries.index');
        Route::get('enquiries/{submission}', [ContactSubmissionController::class, 'show'])->name('enquiries.show');
        Route::patch('enquiries/{submission}', [ContactSubmissionController::class, 'update'])->name('enquiries.update');
        Route::delete('enquiries/{submission}', [ContactSubmissionController::class, 'destroy'])->name('enquiries.destroy');

        Route::get('site-settings', [SiteSettingController::class, 'edit'])->name('site-settings.edit');
        Route::put('site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');
    });
