<?php

use App\Http\Controllers\Admin\ContactSubmissionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FileManagerController;
use App\Http\Controllers\Admin\MediaFileController;
use App\Http\Controllers\Admin\MediaFolderController;
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
        Route::delete('talents/bulk-destroy', [TalentController::class, 'bulkDestroy'])->name('talents.bulk-destroy');
        Route::resource('talents', TalentController::class)->except('show');

        Route::delete('news/bulk-destroy', [NewsController::class, 'bulkDestroy'])->name('news.bulk-destroy');
        Route::resource('news', NewsController::class)->except('show');

        Route::post('team/reorder', [TeamMemberController::class, 'reorder'])->name('team.reorder');
        Route::resource('team', TeamMemberController::class)->except('show')->parameters(['team' => 'teamMember']);

        Route::post('partners/reorder', [PartnerController::class, 'reorder'])->name('partners.reorder');
        Route::resource('partners', PartnerController::class)->except('show');

        Route::resource('media', MediaItemController::class)->except('show')->parameters(['media' => 'mediaItem']);

        Route::get('enquiries', [ContactSubmissionController::class, 'index'])->name('enquiries.index');
        Route::delete('enquiries/bulk-destroy', [ContactSubmissionController::class, 'bulkDestroy'])->name('enquiries.bulk-destroy');
        Route::get('enquiries/{submission}', [ContactSubmissionController::class, 'show'])->name('enquiries.show');
        Route::patch('enquiries/{submission}', [ContactSubmissionController::class, 'update'])->name('enquiries.update');
        Route::delete('enquiries/{submission}', [ContactSubmissionController::class, 'destroy'])->name('enquiries.destroy');

        Route::get('site-settings', [SiteSettingController::class, 'edit'])->name('site-settings.edit');
        Route::put('site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');

        /*
        | File Manager: the single upload/selection surface for the admin.
        | The page is Inertia; everything below it is a small JSON API the
        | React file manager talks to.
        */
        Route::get('files', [FileManagerController::class, 'index'])->name('files.index');

        Route::prefix('file-manager')->name('file-manager.')->group(function () {
            Route::get('browse', [FileManagerController::class, 'browse'])->name('browse');
            Route::get('tree', [FileManagerController::class, 'tree'])->name('tree');

            Route::post('folders', [MediaFolderController::class, 'store'])->name('folders.store');
            Route::patch('folders/{folder}', [MediaFolderController::class, 'update'])->name('folders.update');
            Route::delete('folders/{folder}', [MediaFolderController::class, 'destroy'])->name('folders.destroy');

            Route::post('files', [MediaFileController::class, 'store'])->name('files.store');
            Route::patch('files/{file}', [MediaFileController::class, 'update'])->name('files.update');
            Route::post('files/{file}/move', [MediaFileController::class, 'move'])->name('files.move');
            Route::delete('files/{file}', [MediaFileController::class, 'destroy'])->name('files.destroy');
            Route::get('files/{file}/download', [MediaFileController::class, 'download'])->name('files.download');
            Route::post('files/{file}/share', [MediaFileController::class, 'share'])->name('files.share');
            Route::delete('files/{file}/share', [MediaFileController::class, 'revokeShare'])->name('files.share.revoke');
        });
    });
