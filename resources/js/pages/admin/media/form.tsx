import { Head, Link, useForm } from '@inertiajs/react';
import { FilePicker, type PickedFile } from '@/components/file-manager/file-picker-field';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { NativeSelect } from '@/components/admin/native-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Item = {
    id: number;
    media_type: string;
    category: string | null;
    caption: string | null;
    video_url: string | null;
    talent_id: number | null;
    sort_order: number;
    image_path: string | null;
    image_url: string | null;
};

type Options = {
    types: string[];
    imageCategories: string[];
    videoCategories: string[];
    talents: { id: number; name: string }[];
};

export default function MediaForm({ item, options }: { item: Item | null; options: Options }) {
    const isEdit = !!item;

    const form = useForm<{
        media_type: string;
        category: string;
        caption: string;
        video_url: string;
        talent_id: string;
        sort_order: number;
        image_path: PickedFile | null;
    }>({
        media_type: item?.media_type ?? 'image',
        category: item?.category ?? '',
        caption: item?.caption ?? '',
        video_url: item?.video_url ?? '',
        talent_id: item?.talent_id ? String(item.talent_id) : '',
        sort_order: item?.sort_order ?? 0,
        image_path: item?.image_path ? { path: item.image_path, url: item.image_url } : null,
    });

    const { data, setData, errors, processing } = form;

    const categories = data.media_type === 'video' ? options.videoCategories : options.imageCategories;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        // The picker holds { path, url }; the server only wants the path.
        form.transform((d) => ({ ...d, image_path: d.image_path?.path ?? null }));

        if (isEdit) {
            form.put(`/admin/media/${item!.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/media', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit media' : 'Add media'} />

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader title={isEdit ? 'Edit media' : 'Add media'} description="Images and videos shown in the gallery">
                        <Button asChild variant="ghost"><Link href="/admin/media">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add media'}</Button>
                    </PageHeader>

                    <FormSection title="Media" description="Upload an image or link a video.">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Type" htmlFor="media_type" error={errors.media_type}>
                                <NativeSelect id="media_type" value={data.media_type} onChange={(e) => setData((prev) => ({ ...prev, media_type: e.target.value, category: '' }))}>
                                    {options.types.map((t) => (<option key={t} value={t} className="capitalize">{t}</option>))}
                                </NativeSelect>
                            </Field>
                            <Field label="Category" htmlFor="category" error={errors.category}>
                                <NativeSelect id="category" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                    <option value="">— None —</option>
                                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                                </NativeSelect>
                            </Field>
                        </div>

                        {data.media_type === 'image' ? (
                            <FilePicker label="Image" value={data.image_path} error={errors.image_path} onChange={(f) => setData('image_path', f)} />
                        ) : (
                            <Field label="Video URL (YouTube / Vimeo)" htmlFor="video_url" error={errors.video_url}>
                                <Input id="video_url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                            </Field>
                        )}

                        <Field label="Caption" htmlFor="caption" error={errors.caption}>
                            <Input id="caption" value={data.caption} onChange={(e) => setData('caption', e.target.value)} />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Linked player / coach" htmlFor="talent_id" hint="Optional" error={errors.talent_id}>
                                <NativeSelect id="talent_id" value={data.talent_id} onChange={(e) => setData('talent_id', e.target.value)}>
                                    <option value="">— None —</option>
                                    {options.talents.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                                </NativeSelect>
                            </Field>
                            <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order}>
                                <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                            </Field>
                        </div>
                    </FormSection>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add media'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/media">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
            </form>
        </>
    );
}

MediaForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Gallery', href: '/admin/media' },
    ],
};
