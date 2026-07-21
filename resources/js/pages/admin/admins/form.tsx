import { Head, Link, useForm } from '@inertiajs/react';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Admin = {
    id: number;
    name: string;
    email: string;
};

export default function AdminForm({ admin }: { admin: Admin | null }) {
    const isEdit = !!admin;

    const form = useForm<{ name: string; email: string }>({
        name: admin?.name ?? '',
        email: admin?.email ?? '',
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (isEdit) {
            form.put(`/admin/admins/${admin!.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/admins', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${admin!.name}` : 'Add admin'} />

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader
                        title={isEdit ? 'Edit admin' : 'Add admin'}
                        description={isEdit ? "Update this admin's name and email." : "A password is generated automatically. You'll get a one-time link to share with them."}
                    >
                        <Button asChild variant="ghost"><Link href="/admin/admins">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add admin'}</Button>
                    </PageHeader>

                    <FormSection title="Admin" description="Name and email used to sign in.">
                        <Field label="Name" htmlFor="name" required error={errors.name}>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        </Field>
                        <Field label="Email" htmlFor="email" required error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </Field>
                    </FormSection>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add admin'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/admins">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
            </form>
        </>
    );
}

AdminForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Admins', href: '/admin/admins' },
    ],
};
