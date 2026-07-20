<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactSubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $submissions = ContactSubmission::query()
            ->when(in_array($status, ContactSubmission::STATUSES, true), fn ($q) => $q->where('status', $status))
            ->latest()
            ->get()
            ->map(fn (ContactSubmission $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'phone' => $s->phone,
                'subject' => $s->subject,
                'message' => $s->message,
                'status' => $s->status,
                'created_at' => $s->created_at?->format('j M Y, g:i a'),
            ]);

        return Inertia::render('admin/enquiries/index', [
            'submissions' => $submissions,
            'filters' => ['status' => $status],
            'newCount' => ContactSubmission::where('status', 'new')->count(),
        ]);
    }

    public function show(ContactSubmission $submission): Response
    {
        // Opening an enquiry marks it as handled.
        if ($submission->status === 'new') {
            $submission->update(['status' => 'handled']);
        }

        return Inertia::render('admin/enquiries/show', [
            'submission' => [
                'id' => $submission->id,
                'name' => $submission->name,
                'email' => $submission->email,
                'phone' => $submission->phone,
                'subject' => $submission->subject,
                'message' => $submission->message,
                'status' => $submission->status,
                'created_at' => $submission->created_at?->format('j M Y, g:i a'),
            ],
        ]);
    }

    public function update(Request $request, ContactSubmission $submission): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(ContactSubmission::STATUSES)],
        ]);

        $submission->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Enquiry updated.']);

        return back();
    }

    public function destroy(ContactSubmission $submission): RedirectResponse
    {
        $submission->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Enquiry deleted.']);

        return to_route('admin.enquiries.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:contact_submissions,id'],
        ])['ids'];

        $count = ContactSubmission::whereIn('id', $ids)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => $count === 1 ? 'Enquiry deleted.' : "{$count} enquiries deleted."]);

        return to_route('admin.enquiries.index');
    }
}
