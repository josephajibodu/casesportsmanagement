<?php

use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\PartnerController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\TalentController;
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
| SEO
*/
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::view('/coming-soon', 'coming-soon')->name('coming-soon');

/*
| Authenticated admin (Inertia + React)
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
