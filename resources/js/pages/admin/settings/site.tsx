import { Head, useForm } from '@inertiajs/react';
import { Repeater } from '@/components/admin/repeater';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = Record<string, string>;

type Settings = {
    agency_name: string;
    tagline: string | null;
    agency_story: string | null;
    mission: string | null;
    vision: string | null;
    fifa_license_info: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    services: Row[];
    stats: Row[];
    social_links: Record<string, string>;
};

export default function SiteSettings({
    settings,
    socialKeys,
}: {
    settings: Settings;
    socialKeys: string[];
}) {
    const form = useForm<{
        agency_name: string;
        tagline: string;
        agency_story: string;
        mission: string;
        vision: string;
        fifa_license_info: string;
        email: string;
        phone: string;
        address: string;
        services: Row[];
        stats: Row[];
        social_links: Record<string, string>;
    }>({
        agency_name: settings.agency_name ?? '',
        tagline: settings.tagline ?? '',
        agency_story: settings.agency_story ?? '',
        mission: settings.mission ?? '',
        vision: settings.vision ?? '',
        fifa_license_info: settings.fifa_license_info ?? '',
        email: settings.email ?? '',
        phone: settings.phone ?? '',
        address: settings.address ?? '',
        services: settings.services ?? [],
        stats: settings.stats ?? [],
        social_links: socialKeys.reduce<Record<string, string>>((acc, key) => {
            acc[key] = settings.social_links?.[key] ?? '';
            return acc;
        }, {}),
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put('/admin/site-settings', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Site Settings" />

            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8 p-4">
                <Heading title="Site Settings" description="Content shared across the public website" />

                {/* Identity */}
                <section className="grid gap-5 rounded-xl border p-5">
                    <h2 className="text-sm font-semibold">Agency</h2>
                    <div className="grid gap-2">
                        <Label htmlFor="agency_name">Agency name</Label>
                        <Input id="agency_name" value={data.agency_name} onChange={(e) => setData('agency_name', e.target.value)} required />
                        <InputError message={errors.agency_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
                        <InputError message={errors.tagline} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="agency_story">Agency story</Label>
                        <Textarea id="agency_story" rows={6} value={data.agency_story} onChange={(e) => setData('agency_story', e.target.value)} />
                        <InputError message={errors.agency_story} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="mission">Mission</Label>
                            <Textarea id="mission" rows={3} value={data.mission} onChange={(e) => setData('mission', e.target.value)} />
                            <InputError message={errors.mission} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="vision">Vision</Label>
                            <Textarea id="vision" rows={3} value={data.vision} onChange={(e) => setData('vision', e.target.value)} />
                            <InputError message={errors.vision} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fifa_license_info">FIFA licence info</Label>
                        <Input id="fifa_license_info" value={data.fifa_license_info} onChange={(e) => setData('fifa_license_info', e.target.value)} />
                        <InputError message={errors.fifa_license_info} />
                    </div>
                </section>

                {/* Contact */}
                <section className="grid gap-5 rounded-xl border p-5">
                    <h2 className="text-sm font-semibold">Contact</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Office address</Label>
                        <Textarea id="address" rows={2} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {socialKeys.map((key) => (
                            <div key={key} className="grid gap-2">
                                <Label htmlFor={`social_${key}`} className="capitalize">{key}</Label>
                                <Input
                                    id={`social_${key}`}
                                    value={data.social_links[key] ?? ''}
                                    onChange={(e) => setData('social_links', { ...data.social_links, [key]: e.target.value })}
                                    placeholder="https://"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Services + stats */}
                <section className="grid gap-6 rounded-xl border p-5">
                    <h2 className="text-sm font-semibold">Homepage content</h2>
                    <Repeater
                        label="Services"
                        rows={data.services}
                        onChange={(rows) => setData('services', rows)}
                        fields={[
                            { key: 'group', placeholder: 'Group (e.g. On the Field)' },
                            { key: 'title', placeholder: 'Title' },
                            { key: 'description', placeholder: 'Description' },
                        ]}
                        addLabel="Add service"
                    />
                    <Repeater
                        label="Stats"
                        rows={data.stats}
                        onChange={(rows) => setData('stats', rows)}
                        fields={[
                            { key: 'value', placeholder: 'Value (e.g. 20+)' },
                            { key: 'label', placeholder: 'Label (e.g. Players)' },
                        ]}
                        addLabel="Add stat"
                    />
                </section>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>Save settings</Button>
                </div>
            </form>
        </>
    );
}

SiteSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Site Settings', href: '/admin/site-settings' },
    ],
};
