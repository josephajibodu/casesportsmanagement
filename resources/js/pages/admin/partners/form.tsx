import { Head, Link, useForm } from '@inertiajs/react';
import { ImageUpload } from '@/components/admin/image-upload';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader title={isEdit ? 'Edit partner' : 'Add partner'} description="Display-only logos shown across the site">
                        <Button asChild variant="ghost"><Link href="/admin/partners">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add partner'}</Button>
                    </PageHeader>

                    <FormSection title="Partner" description="Name, logo and description.">
                        <Field label="Name" htmlFor="name" required error={errors.name}>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        </Field>
                        <ImageUpload label="Logo" currentUrl={partner?.logo_url} error={errors.logo} onFile={(f) => setData('logo', f)} hint="Transparent PNG works best." />
                        <Field label="Description" htmlFor="description" hint="Optional" error={errors.description}>
                            <Textarea id="description" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </Field>
                        <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order} className="max-w-40">
                            <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                        </Field>
                    </FormSection>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add partner'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/partners">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
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
