import { Head, Link, useForm } from '@inertiajs/react';
import { FilePicker, type PickedFile } from '@/components/file-manager/file-picker-field';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Member = {
    id: number;
    full_name: string;
    title: string | null;
    bio: string | null;
    sort_order: number;
    photo: string | null;
    photo_url: string | null;
};

export default function TeamForm({ member }: { member: Member | null }) {
    const isEdit = !!member;

    const form = useForm<{
        full_name: string;
        title: string;
        bio: string;
        sort_order: number;
        photo: PickedFile | null;
    }>({
        full_name: member?.full_name ?? '',
        title: member?.title ?? '',
        bio: member?.bio ?? '',
        sort_order: member?.sort_order ?? 0,
        photo: member?.photo ? { path: member.photo, url: member.photo_url } : null,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        // The picker holds { path, url }; the server only wants the path.
        form.transform((d) => ({ ...d, photo: d.photo?.path ?? null }));

        if (isEdit) {
            form.put(`/admin/team/${member!.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/team', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${member!.full_name}` : 'Add team member'} />

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader title={isEdit ? 'Edit team member' : 'Add team member'} description="Shown on the About page">
                        <Button asChild variant="ghost"><Link href="/admin/team">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add member'}</Button>
                    </PageHeader>

                    <FormSection title="Team member" description="Name, role, photo and bio.">
                        <Field label="Full name" htmlFor="full_name" required error={errors.full_name}>
                            <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required />
                        </Field>
                        <Field label="Title / role" htmlFor="title" error={errors.title}>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        </Field>
                        <FilePicker label="Photo" value={data.photo} error={errors.photo} onChange={(f) => setData('photo', f)} />
                        <Field label="Bio" htmlFor="bio" hint="Full bio shown in the Read more modal" error={errors.bio}>
                            <Textarea id="bio" rows={6} value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                        </Field>
                        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order} className="max-w-40">
                            <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        </Field>
                    </FormSection>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add member'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/team">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
            </form>
        </>
    );
}

TeamForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Team', href: '/admin/team' },
    ],
};
