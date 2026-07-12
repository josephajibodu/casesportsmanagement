<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use App\Models\SiteSetting;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function show(): View
    {
        return view('public.contact');
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $submission = ContactSubmission::create($request->safe()->only([
            'name', 'email', 'phone', 'subject', 'message',
        ]));

        $recipient = SiteSetting::current()->email;

        if (filled($recipient)) {
            Mail::to($recipient)->send(new ContactSubmissionReceived($submission));
        }

        return redirect()
            ->route('contact')
            ->with('success', 'Thank you — your message has been received. We will be in touch shortly.');
    }
}
