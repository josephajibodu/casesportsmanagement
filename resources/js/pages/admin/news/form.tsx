import { Head, Link, useForm } from '@inertiajs/react';
import { FilePicker, type PickedFile } from '@/components/file-manager/file-picker-field';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { NativeSelect } from '@/components/admin/native-select';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Article = {
    id: number;
    title: string;
    slug: string | null;
    excerpt: string | null;
    body: string | null;
    category: string | null;
    status: string;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    featured_image: string | null;
    image_url: string | null;
};

type Options = { categories: string[]; statuses: string[] };

export default function NewsForm({ article, options }: { article: Article | null; options: Options }) {
    const isEdit = !!article;

    const form = useForm<{
        title: string;
        slug: string;
        excerpt: string;
        body: string;
        category: string;
        status: string;
        published_at: string;
        meta_title: string;
        meta_description: string;
        featured_image: PickedFile | null;
    }>({
        title: article?.title ?? '',
        slug: article?.slug ?? '',
        excerpt: article?.excerpt ?? '',
        body: article?.body ?? '',
        category: article?.category ?? '',
        status: article?.status ?? 'draft',
        published_at: article?.published_at ?? '',
        meta_title: article?.meta_title ?? '',
        meta_description: article?.meta_description ?? '',
        featured_image: article?.featured_image ? { path: article.featured_image, url: article.image_url } : null,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        // The picker holds { path, url }; the server only wants the path.
        form.transform((d) => ({ ...d, featured_image: d.featured_image?.path ?? null }));

        if (isEdit) {
            form.put(`/admin/news/${article!.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/news', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${article!.title}` : 'New article'} />

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader
                        title={isEdit ? 'Edit article' : 'New article'}
                        description="Attributed to the agency, no author byline"
                    >
                        <Button asChild variant="ghost"><Link href="/admin/news">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Create article'}</Button>
                    </PageHeader>

                    <div className="space-y-10">
                        <FormSection title="Article" description="Headline, image and content.">
                            <Field label="Title" htmlFor="title" required error={errors.title}>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Category" htmlFor="category" error={errors.category}>
                                    <NativeSelect id="category" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                        <option value="">— None —</option>
                                        {options.categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                                    </NativeSelect>
                                </Field>
                                <Field label="Status" htmlFor="status" error={errors.status}>
                                    <NativeSelect id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        {options.statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                                    </NativeSelect>
                                </Field>
                            </div>
                            <Field label="Publish date" htmlFor="published_at" hint="Leave blank to auto-set when published" error={errors.published_at}>
                                <Input id="published_at" type="datetime-local" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
                            </Field>
                            <FilePicker label="Featured image" value={data.featured_image} error={errors.featured_image} onChange={(f) => setData('featured_image', f)} />
                            <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt}>
                                <Textarea id="excerpt" rows={2} value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
                            </Field>
                            <Field label="Body" error={errors.body}>
                                <RichTextEditor value={data.body} onChange={(html) => setData('body', html)} placeholder="Write the article…" />
                            </Field>
                        </FormSection>

                        <FormSection title="SEO" description="Search and social metadata.">
                            <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate" error={errors.slug}>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" />
                            </Field>
                            <Field label="Meta title" htmlFor="meta_title" error={errors.meta_title}>
                                <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                            </Field>
                            <Field label="Meta description" htmlFor="meta_description" error={errors.meta_description}>
                                <Textarea id="meta_description" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                            </Field>
                        </FormSection>
                    </div>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Create article'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/news">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
            </form>
        </>
    );
}

NewsForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'News & Press', href: '/admin/news' },
    ],
};
