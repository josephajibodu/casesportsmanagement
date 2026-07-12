import { Head, Link, useForm } from '@inertiajs/react';
import { ImageUpload } from '@/components/admin/image-upload';
import { NativeSelect } from '@/components/admin/native-select';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        featured_image: File | null;
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
        featured_image: null,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'PUT' }));
            form.post(`/admin/news/${article!.id}`, opts);
        } else {
            form.post('/admin/news', opts);
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${article!.title}` : 'New article'} />

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8 p-4">
                <Heading title={isEdit ? 'Edit article' : 'New article'} description="Attributed to the agency — no author byline" />

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <NativeSelect id="category" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                <option value="">— None —</option>
                                {options.categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.category} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <NativeSelect id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                {options.statuses.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="published_at">Publish date</Label>
                        <Input id="published_at" type="datetime-local" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Leave blank to auto-set when published.</p>
                        <InputError message={errors.published_at} />
                    </div>

                    <ImageUpload
                        label="Featured image"
                        currentUrl={article?.image_url}
                        error={errors.featured_image}
                        onFile={(f) => setData('featured_image', f)}
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" rows={2} value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
                        <InputError message={errors.excerpt} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body">Body</Label>
                        <Textarea id="body" rows={12} value={data.body} onChange={(e) => setData('body', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Basic HTML is supported (e.g. &lt;p&gt;, &lt;strong&gt;).</p>
                        <InputError message={errors.body} />
                    </div>
                </div>

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug (optional)</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" />
                        <InputError message={errors.slug} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="meta_title">Meta title (SEO)</Label>
                        <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                        <InputError message={errors.meta_title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="meta_description">Meta description (SEO)</Label>
                        <Textarea id="meta_description" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                        <InputError message={errors.meta_description} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Create article'}</Button>
                    <Button asChild variant="ghost">
                        <Link href="/admin/news">Cancel</Link>
                    </Button>
                </div>
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
