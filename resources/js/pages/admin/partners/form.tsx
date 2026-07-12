import { Head, Link, useForm } from '@inertiajs/react';
import { ImageUpload } from '@/components/admin/image-upload';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Partner = {
    id: number;
    name: string;
    description: string | null;
    sort_order: number;
    logo_url: string | null;
};

export default function PartnerForm({ partner }: { partner: Partner | null }) {
    const isEdit = !!partner;

    const form = useForm<{
        name: string;
        description: string;
        sort_order: number;
        logo: File | null;
    }>({
        name: partner?.name ?? '',
        description: partner?.description ?? '',
        sort_order: partner?.sort_order ?? 0,
        logo: null,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'PUT' }));
            form.post(`/admin/partners/${partner!.id}`, opts);
        } else {
            form.post('/admin/partners', opts);
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${partner!.name}` : 'Add partner'} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6 p-4">
                <Heading title={isEdit ? 'Edit partner' : 'Add partner'} />

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <ImageUpload label="Logo" currentUrl={partner?.logo_url} error={errors.logo} onFile={(f) => setData('logo', f)} hint="Transparent PNG works best." />
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea id="description" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        <InputError message={errors.sort_order} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add partner'}</Button>
                    <Button asChild variant="ghost">
                        <Link href="/admin/partners">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

PartnerForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Partners', href: '/admin/partners' },
    ],
};
