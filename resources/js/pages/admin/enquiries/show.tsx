import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Copy, Mail, MailOpen, MoreHorizontal, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminPage } from '@/components/admin/layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { avatarColor } from '@/lib/utils';

type Submission = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: string;
    handled_by: string | null;
    handled_at: string | null;
    created_at: string;
};

export default function EnquiryShow({ submission }: { submission: Submission }) {
    const [copied, setCopied] = useState<string | null>(null);
    const getInitials = useInitials();
    const unread = submission.status === 'new';

    function setStatus(status: string) {
        router.patch(`/admin/enquiries/${submission.id}`, { status }, { preserveScroll: true });
    }

    function destroy() {
        if (confirm('Delete this enquiry?')) {
            router.delete(`/admin/enquiries/${submission.id}`);
        }
    }

    function copy(label: string, value: string) {
        navigator.clipboard.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied(null), 1500);
    }

    return (
        <>
            <Head title={`Enquiry from ${submission.name}`} />

            <AdminPage className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="size-4" /> Back to enquiries
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="More actions">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem variant="destructive" onClick={destroy}>
                                <Trash2 className="size-4" /> Delete enquiry
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <Avatar className="size-11">
                                <AvatarFallback className={avatarColor(submission.name)}>{getInitials(submission.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-lg font-semibold tracking-tight">{submission.subject || 'Website enquiry'}</h1>
                                <div className="mt-0.5 text-sm text-muted-foreground">
                                    {submission.name} &middot; Received {submission.created_at}
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => copy('email', submission.email)}
                                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                                    >
                                        <Mail className="size-3.5" />
                                        {submission.email}
                                        <Copy className="size-3 text-muted-foreground" />
                                    </button>
                                    {submission.phone && (
                                        <button
                                            type="button"
                                            onClick={() => copy('phone', submission.phone!)}
                                            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Phone className="size-3.5" />
                                            {submission.phone}
                                            <Copy className="size-3" />
                                        </button>
                                    )}
                                    {copied && <span className="text-xs text-muted-foreground">Copied {copied}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-1 sm:items-end">
                            <Badge variant={unread ? 'default' : 'secondary'} className="uppercase">
                                {submission.status}
                            </Badge>
                            {!unread && submission.handled_by && (
                                <div className="text-xs text-muted-foreground">
                                    by {submission.handled_by}
                                    {submission.handled_at ? ` on ${submission.handled_at}` : ''}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-5">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{submission.message}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild>
                        <a href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.subject || 'Your enquiry')}`}>
                            <Mail className="size-4" /> Reply by email
                        </a>
                    </Button>
                    {unread ? (
                        <Button variant="outline" onClick={() => setStatus('handled')}>
                            <CheckCircle2 className="size-4" /> Mark as handled
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => setStatus('new')}>
                            <MailOpen className="size-4" /> Mark as new
                        </Button>
                    )}
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
