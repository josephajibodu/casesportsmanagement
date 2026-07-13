import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AdminPage } from '@/components/admin/layout';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Submission = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: string;
    created_at: string;
};

export default function EnquiryShow({ submission }: { submission: Submission }) {
    function setStatus(status: string) {
        router.patch(`/admin/enquiries/${submission.id}`, { status }, { preserveScroll: true });
    }

    function destroy() {
        if (confirm('Delete this enquiry?')) {
            router.delete(`/admin/enquiries/${submission.id}`);
        }
    }

    return (
        <>
            <Head title={`Enquiry from ${submission.name}`} />

            <AdminPage className="max-w-3xl space-y-6">
                <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" /> Back to enquiries
                </Link>

                <div className="flex items-start justify-between gap-4">
                    <Heading title={submission.subject || 'Website enquiry'} description={`Received ${submission.created_at}`} />
                    <Badge variant={submission.status === 'new' ? 'default' : 'secondary'}>{submission.status}</Badge>
                </div>

                <div className="grid gap-4 rounded-xl border p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">Name</div>
                            <div className="text-sm font-medium">{submission.name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase">Email</div>
                            <a href={`mailto:${submission.email}`} className="text-sm font-medium text-primary hover:underline">
                                {submission.email}
                            </a>
                        </div>
                        {submission.phone && (
                            <div>
                                <div className="text-xs text-muted-foreground uppercase">Phone</div>
                                <div className="text-sm font-medium">{submission.phone}</div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground uppercase">Message</div>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{submission.message}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild>
                        <a href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.subject || 'Your enquiry')}`}>
                            Reply by email
                        </a>
                    </Button>
                    {submission.status === 'new' ? (
                        <Button variant="outline" onClick={() => setStatus('handled')}>Mark as handled</Button>
                    ) : (
                        <Button variant="outline" onClick={() => setStatus('new')}>Mark as new</Button>
                    )}
                    <Button variant="ghost" onClick={destroy}>
                        <Trash2 className="size-4 text-destructive" /> Delete
                    </Button>
                </div>
            </AdminPage>
        </>
    );
}

EnquiryShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Enquiries', href: '/admin/enquiries' },
    ],
};
