<?php

use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\post;

beforeEach(function () {
    SiteSetting::create(['agency_name' => 'CaSe Sports Management', 'email' => 'info@example.com']);
});

it('stores a valid submission and notifies the agency', function () {
    Mail::fake();

    post(route('contact.store'), [
        'name' => 'Jane Scout',
        'email' => 'jane@example.com',
        'phone' => '+441234567890',
        'subject' => 'Player enquiry',
        'message' => 'I would like to discuss one of your players.',
    ])->assertRedirect(route('contact'))
        ->assertSessionHas('success');

    expect(ContactSubmission::where('email', 'jane@example.com')->exists())->toBeTrue();

    Mail::assertSent(ContactSubmissionReceived::class);
});

it('rejects a submission missing required fields', function () {
    post(route('contact.store'), [
        'name' => '',
        'email' => 'not-an-email',
        'message' => 'short',
    ])->assertSessionHasErrors(['name', 'email', 'message']);

    expect(ContactSubmission::count())->toBe(0);
});

it('blocks submissions that fill the honeypot', function () {
    Mail::fake();

    post(route('contact.store'), [
        'name' => 'Spam Bot',
        'email' => 'bot@example.com',
        'message' => 'This is spam content that is long enough.',
        'website' => 'http://spam.example',
    ])->assertSessionHasErrors('website');

    expect(ContactSubmission::count())->toBe(0);
    Mail::assertNothingSent();
});
