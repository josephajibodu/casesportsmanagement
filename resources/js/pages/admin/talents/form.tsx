import { Head, Link, useForm } from '@inertiajs/react';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { NativeSelect } from '@/components/admin/native-select';
import { Repeater } from '@/components/admin/repeater';
import { FilePicker, MultiFilePicker, type PickedFile } from '@/components/file-manager/file-picker-field';
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
    photo: string | null;
    photo_url: string | null;
};

type Options = { types: string[]; statuses: string[] };

export default function TalentForm({ talent, options }: { talent: Talent | null; options: Options }) {
    const isEdit = !!talent;

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
        photo: PickedFile | null;
        career_history: Row[];
        video_links: Row[];
        gallery_images: PickedFile[];
        video_files: PickedFile[];
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
        photo: talent?.photo ? { path: talent.photo, url: talent.photo_url } : null,
        career_history: talent?.career_history ?? [],
        video_links: talent?.video_links ?? [],
        gallery_images: (talent?.gallery ?? []).map((g) => ({ ...g, type: 'image' as const })),
        video_files: (talent?.videos ?? []).map((v) => ({ ...v, type: 'video' as const })),
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        // Pickers hold { path, url }; the server only wants the paths.
        form.transform((d) => ({
            ...d,
            photo: d.photo?.path ?? null,
            gallery_images: d.gallery_images.map((f) => f.path),
            video_files: d.video_files.map((f) => f.path),
        }));

        if (isEdit) {
            form.put(`/admin/talents/${talent!.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/talents', { preserveScroll: true });
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
                            <FilePicker label="Profile photo" value={data.photo} error={errors.photo} onChange={(f) => setData('photo', f)} />
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

                            <MultiFilePicker
                                label="Highlight videos (uploaded)"
                                values={data.video_files}
                                onChange={(files) => setData('video_files', files)}
                                accept={['video/*']}
                                buttonLabel="Add videos"
                                hint="Served from S3-compatible storage in production."
                            />

                            <Repeater
                                label="Highlight videos (external links)"
                                rows={data.video_links}
                                onChange={(rows) => setData('video_links', rows)}
                                fields={[{ key: 'label', placeholder: 'Label' }, { key: 'url', placeholder: 'YouTube / Vimeo URL' }]}
                                addLabel="Add link"
                            />
                        </FormSection>

                        <FormSection title="Gallery" description="Additional images for the profile.">
                            <MultiFilePicker
                                label="Gallery images"
                                values={data.gallery_images}
                                onChange={(files) => setData('gallery_images', files)}
                                accept={['image/*']}
                                buttonLabel="Add images"
                            />
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
