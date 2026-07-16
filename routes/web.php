<?php

use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\PartnerController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\TalentController;
use App\Http\Controllers\SharedFileController;
use Illuminate\Support\Facades\Route;

/*
| Public marketing site (static Blade build)
*/
Route::get('/', HomeController::class)->name('home');
Route::get('/about', AboutController::class)->name('about');

Route::get('/players', [TalentController::class, 'players'])->name('players.index');
Route::get('/players/{talent}', [TalentController::class, 'showPlayer'])->name('players.show');

Route::get('/coaches', [TalentController::class, 'coaches'])->name('coaches.index');
Route::get('/coaches/{talent}', [TalentController::class, 'showCoach'])->name('coaches.show');

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{article}', [NewsController::class, 'show'])->name('news.show');

Route::get('/gallery', GalleryController::class)->name('gallery');
Route::get('/partners', PartnerController::class)->name('partners');

Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');

/*
| Publicly shared files (links generated from the admin File Manager)
*/
Route::get('/f/{token}', [SharedFileController::class, 'show'])->name('shared-file.show');
Route::post('/f/{token}', [SharedFileController::class, 'unlock'])
    ->middleware('throttle:10,1')
    ->name('shared-file.unlock');

/*
| SEO
*/
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::view('/coming-soon', 'coming-soon')->name('coming-soon');

/*
| Authenticated admin (Inertia + React) — see routes/admin.php
*/
Route::middleware(['auth', 'verified'])
    ->get('dashboard', fn () => redirect()->route('admin.dashboard'))
    ->name('dashboard');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
