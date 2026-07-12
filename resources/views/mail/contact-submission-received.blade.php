<x-mail::message>
# New Contact Enquiry

A new message has been submitted through the website contact form.

**Name:** {{ $submission->name }}
**Email:** {{ $submission->email }}
@if ($submission->phone)
**Phone:** {{ $submission->phone }}
@endif
@if ($submission->subject)
**Subject:** {{ $submission->subject }}
@endif

**Message:**

{{ $submission->message }}

<x-mail::button :url="config('app.url')">
View in Admin
</x-mail::button>

Received {{ $submission->created_at?->format('j M Y, g:i a') }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
