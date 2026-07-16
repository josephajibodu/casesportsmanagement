import { Head } from '@inertiajs/react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { FileManager } from '@/components/file-manager/file-manager';
import { useFileManager } from '@/components/file-manager/use-file-manager';

export default function FilesPage() {
    const fm = useFileManager();

    return (
        <>
            <Head title="Files" />

            <AdminPage>
                <PageHeader
                    title="Files"
                    description="Every image, video and document used across the site"
                />

                <FileManager fm={fm} />
            </AdminPage>
        </>
    );
}

FilesPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Files', href: '/admin/files' },
    ],
};
