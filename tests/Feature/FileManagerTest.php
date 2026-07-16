<?php

use App\Models\MediaFile;
use App\Models\MediaFolder;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
});

/*
|--------------------------------------------------------------------------
| Access
|--------------------------------------------------------------------------
*/

it('blocks guests from the file manager', function () {
    get('/admin/files')->assertRedirect('/login');
    get('/admin/file-manager/browse')->assertRedirect('/login');
});

it('renders the file manager page', function () {
    actingAs($this->user)->get('/admin/files')->assertOk();
});

/*
|--------------------------------------------------------------------------
| Uploading
|--------------------------------------------------------------------------
*/

it('uploads a file and records its metadata', function () {
    actingAs($this->user)
        ->post('/admin/file-manager/files', [
            'files' => [UploadedFile::fake()->image('photo.jpg', 800, 600)],
        ])
        ->assertCreated()
        ->assertJsonPath('files.0.name', 'photo')
        ->assertJsonPath('files.0.type', 'image');

    $file = MediaFile::first();

    expect($file->original_filename)->toBe('photo.jpg')
        ->and($file->extension)->toBe('jpg')
        ->and($file->width)->toBe(800)
        ->and($file->height)->toBe(600)
        ->and($file->uploaded_by)->toBe($this->user->id)
        ->and($file->size)->toBeGreaterThan(0);

    Storage::disk('public')->assertExists($file->path);
});

it('uploads into the selected folder', function () {
    $folder = MediaFolder::create(['name' => 'Players']);

    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('a.jpg')],
        'folder_id' => $folder->id,
    ])->assertCreated();

    expect(MediaFile::first()->folder_id)->toBe($folder->id);
});

/*
|--------------------------------------------------------------------------
| Folders
|--------------------------------------------------------------------------
*/

it('creates nested folders', function () {
    $parent = MediaFolder::create(['name' => 'Media']);

    actingAs($this->user)->post('/admin/file-manager/folders', [
        'name' => 'Players',
        'parent_id' => $parent->id,
    ])->assertCreated();

    expect(MediaFolder::where('name', 'Players')->first()->parent_id)->toBe($parent->id);
});

it('rejects duplicate folder names in the same parent', function () {
    MediaFolder::create(['name' => 'Players']);

    actingAs($this->user)
        ->postJson('/admin/file-manager/folders', ['name' => 'Players'])
        ->assertStatus(422)
        ->assertJsonValidationErrors('name');
});

it('renames a folder', function () {
    $folder = MediaFolder::create(['name' => 'Old']);

    actingAs($this->user)
        ->patchJson("/admin/file-manager/folders/{$folder->id}", ['name' => 'New'])
        ->assertOk();

    expect($folder->fresh()->name)->toBe('New');
});

it('will not move a folder inside itself', function () {
    $folder = MediaFolder::create(['name' => 'Parent']);
    $child = MediaFolder::create(['name' => 'Child', 'parent_id' => $folder->id]);

    actingAs($this->user)
        ->patchJson("/admin/file-manager/folders/{$folder->id}", ['parent_id' => $child->id])
        ->assertStatus(422)
        ->assertJsonValidationErrors('parent_id');
});

it('deletes a folder with its descendants and files', function () {
    $parent = MediaFolder::create(['name' => 'Parent']);
    $child = MediaFolder::create(['name' => 'Child', 'parent_id' => $parent->id]);

    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('a.jpg')],
        'folder_id' => $child->id,
    ]);

    $path = MediaFile::first()->path;

    actingAs($this->user)->deleteJson("/admin/file-manager/folders/{$parent->id}")->assertOk();

    expect(MediaFolder::count())->toBe(0)
        ->and(MediaFile::count())->toBe(0);
    Storage::disk('public')->assertMissing($path);
});

/*
|--------------------------------------------------------------------------
| Browsing, search and filtering
|--------------------------------------------------------------------------
*/

it('browses a folder showing only its own contents', function () {
    $folder = MediaFolder::create(['name' => 'Players']);
    MediaFile::factory()->create(['name' => 'inside', 'folder_id' => $folder->id]);
    MediaFile::factory()->create(['name' => 'outside', 'folder_id' => null]);

    actingAs($this->user)
        ->getJson("/admin/file-manager/browse?folder_id={$folder->id}")
        ->assertOk()
        ->assertJsonCount(1, 'files')
        ->assertJsonPath('files.0.name', 'inside')
        ->assertJsonPath('breadcrumbs.0.name', 'Players');
});

it('searches across every folder', function () {
    $folder = MediaFolder::create(['name' => 'Players']);
    MediaFile::factory()->create(['name' => 'match-day', 'folder_id' => $folder->id]);
    MediaFile::factory()->create(['name' => 'unrelated', 'folder_id' => null]);

    actingAs($this->user)
        ->getJson('/admin/file-manager/browse?search=match')
        ->assertOk()
        ->assertJsonCount(1, 'files')
        ->assertJsonPath('files.0.name', 'match-day');
});

it('filters by file type', function () {
    MediaFile::factory()->create(['name' => 'pic', 'mime_type' => 'image/jpeg']);
    MediaFile::factory()->create(['name' => 'clip', 'mime_type' => 'video/mp4']);
    MediaFile::factory()->create(['name' => 'doc', 'mime_type' => 'application/pdf']);

    actingAs($this->user)->getJson('/admin/file-manager/browse?type=video')
        ->assertJsonCount(1, 'files')
        ->assertJsonPath('files.0.name', 'clip');

    actingAs($this->user)->getJson('/admin/file-manager/browse?type=document')
        ->assertJsonCount(1, 'files')
        ->assertJsonPath('files.0.name', 'doc');
});

it('sorts files', function () {
    MediaFile::factory()->create(['name' => 'b']);
    MediaFile::factory()->create(['name' => 'a']);

    actingAs($this->user)
        ->getJson('/admin/file-manager/browse?sort=name&direction=asc')
        ->assertJsonPath('files.0.name', 'a');
});

/*
|--------------------------------------------------------------------------
| File actions
|--------------------------------------------------------------------------
*/

it('renames a file without touching storage', function () {
    $file = MediaFile::factory()->create(['name' => 'before']);

    actingAs($this->user)
        ->patchJson("/admin/file-manager/files/{$file->id}", ['name' => 'after'])
        ->assertOk();

    expect($file->fresh())
        ->name->toBe('after')
        ->path->toBe($file->path);
});

it('moves a file between folders', function () {
    $folder = MediaFolder::create(['name' => 'Players']);
    $file = MediaFile::factory()->create(['folder_id' => null]);

    actingAs($this->user)
        ->postJson("/admin/file-manager/files/{$file->id}/move", ['folder_id' => $folder->id])
        ->assertOk();

    expect($file->fresh()->folder_id)->toBe($folder->id);
});

it('deletes a file from the database and storage', function () {
    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('a.jpg')],
    ]);

    $file = MediaFile::first();

    actingAs($this->user)->deleteJson("/admin/file-manager/files/{$file->id}")->assertOk();

    expect(MediaFile::count())->toBe(0);
    Storage::disk('public')->assertMissing($file->path);
});

/*
|--------------------------------------------------------------------------
| Sharing
|--------------------------------------------------------------------------
*/

it('generates a share link and reuses the token', function () {
    $file = MediaFile::factory()->create();

    actingAs($this->user)->postJson("/admin/file-manager/files/{$file->id}/share")
        ->assertOk()
        ->assertJsonPath('file.is_shared', true);

    $token = $file->fresh()->share_token;
    expect($token)->not->toBeNull();

    // Sharing again keeps the same link.
    actingAs($this->user)->postJson("/admin/file-manager/files/{$file->id}/share")->assertOk();
    expect($file->fresh()->share_token)->toBe($token);

    // Unless a new one is explicitly requested.
    actingAs($this->user)->postJson("/admin/file-manager/files/{$file->id}/share", ['regenerate' => true])->assertOk();
    expect($file->fresh()->share_token)->not->toBe($token);
});

it('revokes a share link', function () {
    $file = MediaFile::factory()->create();
    $file->share();

    actingAs($this->user)->deleteJson("/admin/file-manager/files/{$file->id}/share")
        ->assertOk()
        ->assertJsonPath('file.is_shared', false);

    expect($file->fresh()->share_token)->toBeNull();
});

it('serves a shared file publicly', function () {
    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('shared.jpg')],
    ]);

    $file = MediaFile::first();
    $file->share();

    // Guests can open the link.
    get("/f/{$file->share_token}")->assertOk();
});

it('404s on an unknown or expired share link', function () {
    get('/f/does-not-exist')->assertNotFound();

    $file = MediaFile::factory()->create();
    $file->share(expiresAt: now()->subDay());

    get("/f/{$file->share_token}")->assertNotFound();
});

it('asks for a password on a protected share link', function () {
    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('secret.jpg')],
    ]);

    $file = MediaFile::first();
    $file->share(password: 'letmein');

    get("/f/{$file->share_token}")->assertOk()->assertSee('password protected');

    post("/f/{$file->share_token}", ['password' => 'wrong'])->assertSessionHasErrors('password');

    post("/f/{$file->share_token}", ['password' => 'letmein'])
        ->assertRedirect(route('shared-file.show', $file->share_token));
});

/*
|--------------------------------------------------------------------------
| Storage drivers
|
| The File Manager only ever talks to the Storage API, so swapping MEDIA_DISK
| to an S3-compatible provider (R2) must not need any other change.
|--------------------------------------------------------------------------
*/

it('stores uploads on the configured media disk and records it per file', function () {
    Storage::fake('r2');
    config(['media.disk' => 'r2']);

    actingAs($this->user)->post('/admin/file-manager/files', [
        'files' => [UploadedFile::fake()->image('on-r2.jpg')],
    ])->assertCreated();

    $file = MediaFile::first();

    // The disk is recorded on the row, so files keep resolving through the
    // disk they were written to even after MEDIA_DISK changes later.
    expect($file->disk)->toBe('r2');
    Storage::disk('r2')->assertExists($file->path);
    Storage::disk('public')->assertMissing($file->path);
});

it('builds public r2 urls from the bucket domain', function () {
    // A real R2 disk: building a URL is local, so this needs no network.
    config([
        'filesystems.disks.r2.key' => 'test-key',
        'filesystems.disks.r2.secret' => 'test-secret',
        'filesystems.disks.r2.bucket' => 'case-media',
        'filesystems.disks.r2.endpoint' => 'https://account.r2.cloudflarestorage.com',
        'filesystems.disks.r2.url' => 'https://media.example.com',
    ]);

    $file = MediaFile::factory()->create(['disk' => 'r2', 'path' => 'media/2026/07/a.jpg']);

    expect($file->url())->toBe('https://media.example.com/media/2026/07/a.jpg');
});

it('serves signed r2 urls when the bucket has no public domain', function () {
    config([
        'media.signed_urls' => true,
        'filesystems.disks.r2.key' => 'test-key',
        'filesystems.disks.r2.secret' => 'test-secret',
        'filesystems.disks.r2.bucket' => 'case-media',
        'filesystems.disks.r2.endpoint' => 'https://account.r2.cloudflarestorage.com',
        'filesystems.disks.r2.url' => null,
    ]);

    $file = MediaFile::factory()->create(['disk' => 'r2', 'path' => 'media/2026/07/a.jpg']);
    $url = $file->url();

    expect($url)->toContain('media/2026/07/a.jpg')
        ->and($url)->toContain('X-Amz-Signature')
        ->and($url)->toContain('X-Amz-Expires');
});

it('leaves absolute urls untouched', function () {
    expect(media_url('https://picsum.photos/seed/x/900/1100'))
        ->toBe('https://picsum.photos/seed/x/900/1100');
});

it('does not break when a disk cannot sign urls', function () {
    config(['media.signed_urls' => true]);

    // The local disk has no temporaryUrl support, so it must fall back to the
    // public URL rather than throwing.
    expect(media_url('media/2026/07/a.jpg'))->toContain('media/2026/07/a.jpg');
});

it('r2 is configured the way cloudflare requires', function () {
    $disk = config('filesystems.disks.r2');

    // R2 has no ACLs: sending `ACL: public-read` is rejected, so visibility
    // must stay private and public access comes from the bucket domain.
    expect($disk['visibility'])->toBe('private')
        ->and($disk['driver'])->toBe('s3')
        ->and($disk['region'])->toBe('auto');
});
