<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactSubmission $submission) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New contact enquiry: '.($this->submission->subject ?: 'Website contact form'),
            replyTo: [$this->submission->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact-submission-received',
            with: ['submission' => $this->submission],
        );
    }
}
