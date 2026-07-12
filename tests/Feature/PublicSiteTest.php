<?php

use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Partner;
use App\Models\Talent;
use App\Models\TeamMember;

use function Pest\Laravel\get;

beforeEach(function () {
    $this->talent = Talent::factory()->player()->featured()->create(['status' => 'published']);
    Talent::factory()->coach()->create(['status' => 'published']);
    Talent::factory()->create(['status' => 'draft']);
    $this->article = NewsArticle::factory()->create(['status' => 'published', 'published_at' => now()->subDay()]);
    NewsArticle::factory()->draft()->create();
    TeamMember::factory()->count(3)->create();
    Partner::factory()->count(3)->create();
    MediaItem::factory()->count(4)->create();
    MediaItem::factory()->video()->count(2)->create();
});

it('renders the homepage', function () {
    get('/')->assertOk()->assertSee('CaSe');
});

it('renders every top-level public page', function (string $path) {
    get($path)->assertOk();
})->with([
    '/about',
    '/players',
    '/coaches',
    '/news',
    '/gallery',
    '/gallery?tab=video',
    '/partners',
    '/contact',
    '/sitemap.xml',
]);

it('renders a player profile', function () {
    get(route('players.show', $this->talent))
        ->assertOk()
        ->assertSee($this->talent->full_name);
});

it('404s when a player slug is requested under the coaches route', function () {
    get(route('coaches.show', $this->talent))->assertNotFound();
});

it('renders a news article', function () {
    get(route('news.show', $this->article))
        ->assertOk()
        ->assertSee($this->article->title);
});

it('hides draft talent from the public', function () {
    $draft = Talent::factory()->player()->create(['status' => 'draft']);

    get(route('players.show', $draft))->assertNotFound();
});

it('hides draft news from the public', function () {
    $draft = NewsArticle::factory()->draft()->create();

    get(route('news.show', $draft))->assertNotFound();
});

it('separates players from coaches', function () {
    // The featured player from beforeEach should not appear on the coaches listing.
    get(route('coaches.index'))
        ->assertOk()
        ->assertDontSee($this->talent->full_name);

    get(route('players.index'))
        ->assertOk()
        ->assertSee($this->talent->full_name);
});
