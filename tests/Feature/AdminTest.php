<?php

use App\Models\ContactSubmission;
use App\Models\MediaItem;
use App\Models\NewsArticle;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\Talent;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
});

it('blocks guests from the admin', function () {
    get('/admin')->assertRedirect('/login');
});

it('shows the admin dashboard to authenticated users', function () {
    actingAs($this->user)->get('/admin')->assertOk();
});

it('renders each admin index', function (string $path) {
    actingAs($this->user)->get($path)->assertOk();
})->with([
    '/admin/talents',
    '/admin/news',
    '/admin/team',
    '/admin/partners',
    '/admin/media',
    '/admin/enquiries',
    '/admin/site-settings',
]);

it('creates a talent with an uploaded photo', function () {
    actingAs($this->user)->post('/admin/talents', [
        'type' => 'player',
        'full_name' => 'Test Winger',
        'status' => 'published',
        'is_featured' => '1',
        'sort_order' => 0,
        'photo' => UploadedFile::fake()->image('player.jpg'),
        'career_history' => [['club' => 'Test FC', 'years' => '2020–2023'], ['club' => '', 'years' => '']],
        'video_links' => [['label' => 'Reel', 'url' => 'https://youtube.com/watch?v=abc']],
    ])->assertRedirect('/admin/talents');

    $talent = Talent::firstWhere('full_name', 'Test Winger');

    expect($talent)->not->toBeNull()
        ->and($talent->is_featured)->toBeTrue()
        ->and($talent->slug)->toBe('test-winger')
        ->and($talent->career_history)->toHaveCount(1) // empty row dropped
        ->and($talent->photo)->not->toBeNull();

    Storage::disk('public')->assertExists($talent->photo);
});

it('uploads highlight videos for a talent', function () {
    actingAs($this->user)->post('/admin/talents', [
        'type' => 'player',
        'full_name' => 'Video Star',
        'status' => 'published',
        'video_uploads' => [UploadedFile::fake()->create('reel.mp4', 2048, 'video/mp4')],
    ])->assertRedirect('/admin/talents');

    $talent = Talent::firstWhere('full_name', 'Video Star');

    expect($talent->video_files)->toHaveCount(1);
    Storage::disk('public')->assertExists($talent->video_files[0]);
});

it('updates a talent', function () {
    $talent = Talent::factory()->create(['full_name' => 'Before', 'type' => 'player']);

    actingAs($this->user)->put("/admin/talents/{$talent->id}", [
        'type' => 'coach',
        'full_name' => 'After Name',
        'status' => 'published',
        'sort_order' => 5,
    ])->assertRedirect('/admin/talents');

    expect($talent->fresh())
        ->full_name->toBe('After Name')
        ->type->toBe('coach');
});

it('toggles featured', function () {
    $talent = Talent::factory()->create(['is_featured' => false]);

    actingAs($this->user)->patch("/admin/talents/{$talent->id}/featured");

    expect($talent->fresh()->is_featured)->toBeTrue();
});

it('deletes a talent and its photo', function () {
    $path = UploadedFile::fake()->image('p.jpg')->store('talents', 'public');
    $talent = Talent::factory()->create(['photo' => $path]);

    actingAs($this->user)->delete("/admin/talents/{$talent->id}")->assertRedirect('/admin/talents');

    expect(Talent::find($talent->id))->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

it('creates a news article and auto-sets publish date', function () {
    actingAs($this->user)->post('/admin/news', [
        'title' => 'Big Announcement',
        'status' => 'published',
        'body' => '<p>Hello world</p>',
    ])->assertRedirect('/admin/news');

    $article = NewsArticle::firstWhere('title', 'Big Announcement');

    expect($article)->not->toBeNull()
        ->and($article->published_at)->not->toBeNull()
        ->and($article->slug)->toBe('big-announcement');
});

it('creates a team member', function () {
    actingAs($this->user)->post('/admin/team', [
        'full_name' => 'Jane Manager',
        'title' => 'Director',
    ])->assertRedirect('/admin/team');

    expect(TeamMember::where('full_name', 'Jane Manager')->exists())->toBeTrue();
});

it('creates a partner', function () {
    actingAs($this->user)->post('/admin/partners', [
        'name' => 'Acme Corp',
    ])->assertRedirect('/admin/partners');

    expect(Partner::where('name', 'Acme Corp')->exists())->toBeTrue();
});

it('creates an image media item', function () {
    actingAs($this->user)->post('/admin/media', [
        'media_type' => 'image',
        'category' => 'Events',
        'caption' => 'A moment',
        'image' => UploadedFile::fake()->image('shot.jpg'),
    ])->assertRedirect('/admin/media');

    expect(MediaItem::where('caption', 'A moment')->exists())->toBeTrue();
});

it('requires a video url for a video media item', function () {
    actingAs($this->user)->post('/admin/media', [
        'media_type' => 'video',
        'caption' => 'No url',
    ])->assertSessionHasErrors('video_url');
});

it('marks an enquiry handled when opened', function () {
    $submission = ContactSubmission::create([
        'name' => 'Scout', 'email' => 's@example.com', 'message' => 'Interested.', 'status' => 'new',
    ]);

    actingAs($this->user)->get("/admin/enquiries/{$submission->id}")->assertOk();

    expect($submission->fresh()->status)->toBe('handled');
});

it('deletes an enquiry', function () {
    $submission = ContactSubmission::create([
        'name' => 'Scout', 'email' => 's@example.com', 'message' => 'Interested.',
    ]);

    actingAs($this->user)->delete("/admin/enquiries/{$submission->id}")->assertRedirect('/admin/enquiries');

    expect(ContactSubmission::find($submission->id))->toBeNull();
});

it('updates site settings including json fields', function () {
    SiteSetting::current();

    actingAs($this->user)->put('/admin/site-settings', [
        'agency_name' => 'New Name',
        'email' => 'hi@example.com',
        'address_line1' => 'Mile 2',
        'city' => 'Limbe',
        'province' => 'Fako',
        'country' => 'Cameroon',
        'services' => [['group' => '', 'title' => 'Rep', 'description' => 'desc'], ['group' => '', 'title' => '', 'description' => '']],
        'stats' => [['value' => '10+', 'label' => 'Players']],
        'social_links' => ['instagram' => 'https://insta.com/x', 'twitter' => ''],
    ])->assertRedirect('/admin/site-settings');

    $settings = SiteSetting::current();

    expect($settings->agency_name)->toBe('New Name')
        ->and($settings->city)->toBe('Limbe')
        ->and($settings->country)->toBe('Cameroon')
        ->and($settings->formatted_address)->toBe('Mile 2, Limbe, Fako, Cameroon')
        ->and($settings->services)->toHaveCount(1) // empty row dropped
        ->and($settings->social_links)->toBe(['instagram' => 'https://insta.com/x']); // empty dropped
});
