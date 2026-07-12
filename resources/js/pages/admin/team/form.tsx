import { Head, Link, useForm } from '@inertiajs/react';
import { ImageUpload } from '@/components/admin/image-upload';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Member = {
    id: number;
    full_name: string;
    title: string | null;
    bio: string | null;
    sort_order: number;
    photo_url: string | null;
};

export default function TeamForm({ member }: { member: Member | null }) {
    const isEdit = !!member;

    const form = useForm<{
        full_name: string;
        title: string;
        bio: string;
        sort_order: number;
        photo: File | null;
    }>({
        full_name: member?.full_name ?? '',
        title: member?.title ?? '',
        bio: member?.bio ?? '',
        sort_order: member?.sort_order ?? 0,
        photo: null,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'PUT' }));
            form.post(`/admin/team/${member!.id}`, opts);
        } else {
            form.post('/admin/team', opts);
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${member!.full_name}` : 'Add team member'} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6 p-4">
                <Heading title={isEdit ? 'Edit team member' : 'Add team member'} />

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2">
                        <Label htmlFor="full_name">Full name</Label>
                        <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required />
                        <InputError message={errors.full_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title / role</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        <InputError message={errors.title} />
                    </div>
                    <ImageUpload label="Photo" currentUrl={member?.photo_url} error={errors.photo} onFile={(f) => setData('photo', f)} />
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Short bio</Label>
                        <Textarea id="bio" rows={4} value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                        <InputError message={errors.bio} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        <InputError message={errors.sort_order} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add member'}</Button>
                    <Button asChild variant="ghost">
                        <Link href="/admin/team">Cancel</Link>
                    </Button>
                </div>
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
