import { Head, Link, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { NativeSelect } from '@/components/admin/native-select';
import { Repeater } from '@/components/admin/repeater';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = Record<string, string>;

type Talent = {
    id: number;
    type: string;
    full_name: string;
    slug: string | null;
    position: string | null;
    nationality: string | null;
    current_club: string | null;
    biography: string | null;
    career_history: Row[];
    video_links: Row[];
    gallery: { path: string; url: string }[];
    is_featured: boolean;
    status: string;
    sort_order: number;
    meta_title: string | null;
    meta_description: string | null;
    photo_url: string | null;
};

type Options = { types: string[]; statuses: string[] };

export default function TalentForm({ talent, options }: { talent: Talent | null; options: Options }) {
    const isEdit = !!talent;

    const [existingGallery, setExistingGallery] = useState(talent?.gallery ?? []);
    const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);

    const form = useForm<{
        type: string;
        full_name: string;
        slug: string;
        position: string;
        nationality: string;
        current_club: string;
        biography: string;
        status: string;
        sort_order: number;
        is_featured: boolean;
        meta_title: string;
        meta_description: string;
        photo: File | null;
        career_history: Row[];
        video_links: Row[];
        existing_gallery: string[];
        gallery_uploads: File[];
    }>({
        type: talent?.type ?? 'player',
        full_name: talent?.full_name ?? '',
        slug: talent?.slug ?? '',
        position: talent?.position ?? '',
        nationality: talent?.nationality ?? '',
        current_club: talent?.current_club ?? '',
        biography: talent?.biography ?? '',
        status: talent?.status ?? 'draft',
        sort_order: talent?.sort_order ?? 0,
        is_featured: talent?.is_featured ?? false,
        meta_title: talent?.meta_title ?? '',
        meta_description: talent?.meta_description ?? '',
        photo: null,
        career_history: talent?.career_history ?? [],
        video_links: talent?.video_links ?? [],
        existing_gallery: (talent?.gallery ?? []).map((g) => g.path),
        gallery_uploads: [],
    });

    const { data, setData, errors, processing } = form;

    function removeExisting(path: string) {
        setExistingGallery((prev) => prev.filter((g) => g.path !== path));
        setData('existing_gallery', data.existing_gallery.filter((p) => p !== path));
    }

    function addUploads(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setData('gallery_uploads', [...data.gallery_uploads, ...files]);
        setUploadPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        e.target.value = '';
    }

    function removeUpload(index: number) {
        setData('gallery_uploads', data.gallery_uploads.filter((_, i) => i !== index));
        setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'PUT' }));
            form.post(`/admin/talents/${talent!.id}`, opts);
        } else {
            form.post('/admin/talents', opts);
        }
    }

    return (
        <>
            <Head title={isEdit ? `Edit ${talent!.full_name}` : 'Add profile'} />

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8 p-4">
                <Heading
                    title={isEdit ? 'Edit profile' : 'Add profile'}
                    description="Player or coach details shown on the public site"
                />

                <div className="grid gap-5 rounded-xl border p-5">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <NativeSelect
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                {options.types.map((t) => (
                                    <option key={t} value={t} className="capitalize">
                                        {t}
                                    </option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <NativeSelect
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                {options.statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="full_name">Full name</Label>
                        <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required />
                        <InputError message={errors.full_name} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="position">Position / role</Label>
                            <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            <InputError message={errors.position} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input id="nationality" value={data.nationality} onChange={(e) => setData('nationality', e.target.value)} />
                            <InputError message={errors.nationality} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="current_club">Current club</Label>
                            <Input id="current_club" value={data.current_club} onChange={(e) => setData('current_club', e.target.value)} />
                            <InputError message={errors.current_club} />
                        </div>
                    </div>

                    <ImageUpload
                        label="Profile photo"
                        currentUrl={talent?.photo_url}
                        error={errors.photo}
                        onFile={(f) => setData('photo', f)}
                        hint="JPG or PNG, up to 5MB."
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="biography">Biography</Label>
                        <Textarea id="biography" rows={6} value={data.biography} onChange={(e) => setData('biography', e.target.value)} />
                        <InputError message={errors.biography} />
                    </div>
                </div>

                <div className="grid gap-5 rounded-xl border p-5">
                    <Repeater
                        label="Career history"
                        rows={data.career_history}
                        onChange={(rows) => setData('career_history', rows)}
                        fields={[
                            { key: 'club', placeholder: 'Club' },
                            { key: 'years', placeholder: 'Years (e.g. 2021–Present)' },
                        ]}
                        addLabel="Add club"
                    />

                    <Repeater
                        label="Highlight videos"
                        rows={data.video_links}
                        onChange={(rows) => setData('video_links', rows)}
                        fields={[
                            { key: 'label', placeholder: 'Label' },
                            { key: 'url', placeholder: 'YouTube / Vimeo URL' },
                        ]}
                        addLabel="Add video"
                    />
                </div>

                <div className="grid gap-4 rounded-xl border p-5">
                    <Label>Additional gallery images</Label>
                    <div className="flex flex-wrap gap-3">
                        {existingGallery.map((g) => (
                            <div key={g.path} className="relative size-24 overflow-hidden rounded-lg border">
                                <img src={g.url} alt="" className="size-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExisting(g.path)}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                                    aria-label="Remove image"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        ))}
                        {uploadPreviews.map((src, i) => (
                            <div key={src} className="relative size-24 overflow-hidden rounded-lg border">
                                <img src={src} alt="" className="size-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeUpload(i)}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                                    aria-label="Remove image"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={addUploads}
                        className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent"
                    />
                </div>

                <div className="grid gap-5 rounded-xl border p-5">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) => setData('is_featured', e.target.checked)}
                            className="size-4 rounded border-input"
                        />
                        <span className="text-sm font-medium">Featured on homepage</span>
                    </label>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (optional)</Label>
                            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" />
                            <InputError message={errors.slug} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                            <InputError message={errors.sort_order} />
                        </div>
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
                    <Button type="submit" disabled={processing}>
                        {isEdit ? 'Save changes' : 'Create profile'}
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/admin/talents">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

TalentForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Players & Coaches', href: '/admin/talents' },
    ],
};
