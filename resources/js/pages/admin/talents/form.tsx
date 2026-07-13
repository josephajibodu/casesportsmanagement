import { Head, Link, useForm } from '@inertiajs/react';
import { FileVideo, X } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { NativeSelect } from '@/components/admin/native-select';
import { Repeater } from '@/components/admin/repeater';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = Record<string, string>;
type Stored = { path: string; url: string };

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
    videos: Stored[];
    gallery: Stored[];
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
    const [existingVideos, setExistingVideos] = useState(talent?.videos ?? []);
    const [videoNames, setVideoNames] = useState<string[]>([]);

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
        existing_videos: string[];
        video_uploads: File[];
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
        existing_videos: (talent?.videos ?? []).map((v) => v.path),
        video_uploads: [],
    });

    const { data, setData, errors, processing } = form;

    function removeExistingGallery(path: string) {
        setExistingGallery((prev) => prev.filter((g) => g.path !== path));
        setData('existing_gallery', data.existing_gallery.filter((p) => p !== path));
    }
    function addGalleryUploads(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setData('gallery_uploads', [...data.gallery_uploads, ...files]);
        setUploadPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        e.target.value = '';
    }
    function removeGalleryUpload(index: number) {
        setData('gallery_uploads', data.gallery_uploads.filter((_, i) => i !== index));
        setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function removeExistingVideo(path: string) {
        setExistingVideos((prev) => prev.filter((v) => v.path !== path));
        setData('existing_videos', data.existing_videos.filter((p) => p !== path));
    }
    function addVideoUploads(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setData('video_uploads', [...data.video_uploads, ...files]);
        setVideoNames((prev) => [...prev, ...files.map((f) => f.name)]);
        e.target.value = '';
    }
    function removeVideoUpload(index: number) {
        setData('video_uploads', data.video_uploads.filter((_, i) => i !== index));
        setVideoNames((prev) => prev.filter((_, i) => i !== index));
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

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader
                        title={isEdit ? 'Edit profile' : 'Add profile'}
                        description="Player or coach details shown on the public site"
                    >
                        <Button asChild variant="ghost">
                            <Link href="/admin/talents">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Create profile'}</Button>
                    </PageHeader>

                    <div className="space-y-10">
                        <FormSection title="Profile" description="Core details and headshot.">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Type" htmlFor="type" error={errors.type}>
                                    <NativeSelect id="type" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                        {options.types.map((t) => (<option key={t} value={t} className="capitalize">{t}</option>))}
                                    </NativeSelect>
                                </Field>
                                <Field label="Status" htmlFor="status" error={errors.status}>
                                    <NativeSelect id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        {options.statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                                    </NativeSelect>
                                </Field>
                            </div>
                            <Field label="Full name" htmlFor="full_name" required error={errors.full_name}>
                                <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-3">
                                <Field label="Position / role" htmlFor="position" error={errors.position}>
                                    <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                                </Field>
                                <Field label="Nationality" htmlFor="nationality" error={errors.nationality}>
                                    <Input id="nationality" value={data.nationality} onChange={(e) => setData('nationality', e.target.value)} />
                                </Field>
                                <Field label="Current club" htmlFor="current_club" error={errors.current_club}>
                                    <Input id="current_club" value={data.current_club} onChange={(e) => setData('current_club', e.target.value)} />
                                </Field>
                            </div>
                            <ImageUpload label="Profile photo" currentUrl={talent?.photo_url} error={errors.photo} onFile={(f) => setData('photo', f)} hint="JPG or PNG, up to 5MB." />
                            <Field label="Biography" htmlFor="biography" error={errors.biography}>
                                <Textarea id="biography" rows={6} value={data.biography} onChange={(e) => setData('biography', e.target.value)} />
                            </Field>
                        </FormSection>

                        <FormSection title="Career & highlights" description="History and highlight videos.">
                            <Repeater
                                label="Career history"
                                rows={data.career_history}
                                onChange={(rows) => setData('career_history', rows)}
                                fields={[{ key: 'club', placeholder: 'Club' }, { key: 'years', placeholder: 'Years (e.g. 2021-Present)' }]}
                                addLabel="Add club"
                            />

                            {/* Uploaded highlight videos (stored on the media disk / S3) */}
                            <div className="grid gap-3">
                                <Label>Highlight videos (uploads)</Label>
                                {(existingVideos.length > 0 || videoNames.length > 0) && (
                                    <div className="grid gap-2">
                                        {existingVideos.map((v) => (
                                            <div key={v.path} className="flex items-center gap-3 rounded-lg border p-2">
                                                <video src={v.url} className="h-12 w-20 rounded bg-black object-cover" />
                                                <span className="flex-1 truncate text-sm text-muted-foreground">{v.path.split('/').pop()}</span>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeExistingVideo(v.path)} aria-label="Remove">
                                                    <X className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                        {videoNames.map((name, i) => (
                                            <div key={`${name}-${i}`} className="flex items-center gap-3 rounded-lg border border-dashed p-2">
                                                <span className="flex h-12 w-20 items-center justify-center rounded bg-muted"><FileVideo className="size-5 text-muted-foreground" /></span>
                                                <span className="flex-1 truncate text-sm">{name}</span>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoUpload(i)} aria-label="Remove">
                                                    <X className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/webm,video/ogg,.mp4,.mov,.webm,.ogg,.m4v"
                                    multiple
                                    onChange={addVideoUploads}
                                    className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent"
                                />
                                <p className="text-xs text-muted-foreground">MP4, MOV, WEBM up to 500MB. Served from S3-compatible storage in production.</p>
                            </div>

                            <Repeater
                                label="Highlight videos (external links)"
                                rows={data.video_links}
                                onChange={(rows) => setData('video_links', rows)}
                                fields={[{ key: 'label', placeholder: 'Label' }, { key: 'url', placeholder: 'YouTube / Vimeo URL' }]}
                                addLabel="Add link"
                            />
                        </FormSection>

                        <FormSection title="Gallery" description="Additional images for the profile.">
                            <div className="flex flex-wrap gap-3">
                                {existingGallery.map((g) => (
                                    <div key={g.path} className="relative size-24 overflow-hidden rounded-lg border">
                                        <img src={g.url} alt="" className="size-full object-cover" />
                                        <button type="button" onClick={() => removeExistingGallery(g.path)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white" aria-label="Remove image"><X className="size-3" /></button>
                                    </div>
                                ))}
                                {uploadPreviews.map((src, i) => (
                                    <div key={src} className="relative size-24 overflow-hidden rounded-lg border">
                                        <img src={src} alt="" className="size-full object-cover" />
                                        <button type="button" onClick={() => removeGalleryUpload(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white" aria-label="Remove image"><X className="size-3" /></button>
                                    </div>
                                ))}
                            </div>
                            <input type="file" accept="image/*" multiple onChange={addGalleryUploads} className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent" />
                        </FormSection>

                        <FormSection title="Publishing & SEO" description="Visibility, ordering and search metadata.">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="size-4 rounded border-input" />
                                <span className="text-sm font-medium">Featured on homepage</span>
                            </label>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate" error={errors.slug}>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated" />
                                </Field>
                                <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order}>
                                    <Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} />
                                </Field>
                            </div>
                            <Field label="Meta title" htmlFor="meta_title" error={errors.meta_title}>
                                <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                            </Field>
                            <Field label="Meta description" htmlFor="meta_description" error={errors.meta_description}>
                                <Textarea id="meta_description" rows={2} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                            </Field>
                        </FormSection>
                    </div>

                    <FormActions>
                        <Button type="submit" disabled={processing}>{isEdit ? 'Save changes' : 'Create profile'}</Button>
                        <Button asChild variant="ghost"><Link href="/admin/talents">Cancel</Link></Button>
                    </FormActions>
                </AdminPage>
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
