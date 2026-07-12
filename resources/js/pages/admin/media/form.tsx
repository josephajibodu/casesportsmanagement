import { Head, Link, useForm } from '@inertiajs/react';
import { ImageUpload } from '@/components/admin/image-upload';
import { NativeSelect } from '@/components/admin/native-select';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Item = {
    id: number;
    media_type: string;
    category: string | null;
    caption: string | null;
    video_url: string | null;
    talent_id: number | null;
    sort_order: number;
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
        image: File | null;
    }>({
        media_type: item?.media_type ?? 'image',
        category: item?.category ?? '',
        caption: item?.caption ?? '',
        video_url: item?.video_url ?? '',
        talent_id: item?.talent_id ? String(item.talent_id) : '',
        sort_order: item?.sort_order ?? 0,
        image: null,
    });

    const { data, setData, errors, processing } = form;

    const categories = data.media_type === 'video' ? options.videoCategories : options.imageCategories;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'PUT' }));
            form.post(`/admin/media/${item!.id}`, opts);
        } else {
            form.post('/admin/media', opts);
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit media' : 'Add media'} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6 p-4">
                <Heading title={isEdit ? 'Edit media' : 'Add media'} />

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="media_type">Type</Label>
                            <NativeSelect
                                id="media_type"
                                value={data.media_type}
                                onChange={(e) => setData((prev) => ({ ...prev, media_type: e.target.value, category: '' }))}
                            >
                                {options.types.map((t) => (
                                    <option key={t} value={t} className="capitalize">{t}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.media_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <NativeSelect id="category" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                <option value="">— None —</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.category} />
                        </div>
                    </div>

                    {data.media_type === 'image' ? (
                        <ImageUpload label="Image" currentUrl={item?.image_url} error={errors.image} onFile={(f) => setData('image', f)} />
                    ) : (
                        <div className="grid gap-2">
                            <Label htmlFor="video_url">Video URL (YouTube / Vimeo)</Label>
                            <Input id="video_url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                            <InputError message={errors.video_url} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Input id="caption" value={data.caption} onChange={(e) => setData('caption', e.target.value)} />
                        <InputError message={errors.caption} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="talent_id">Linked player / coach (optional)</Label>
                            <NativeSelect id="talent_id" value={data.talent_id} onChange={(e) => setData('talent_id', e.target.value)}>
                                <option value="">— None —</option>
                                {options.talents.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.talent_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                            <InputError message={errors.sort_order} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Add media'}</Button>
                    <Button asChild variant="ghost">
                        <Link href="/admin/media">Cancel</Link>
                    </Button>
                </div>
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
