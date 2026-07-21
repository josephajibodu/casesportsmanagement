import { Head, useForm } from '@inertiajs/react';
import { AdminPage, Field, FormActions, FormSection, PageHeader } from '@/components/admin/layout';
import { Repeater } from '@/components/admin/repeater';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    services: Row[];
    stats: Row[];
    social_links: Record<string, string>;
    registration_enabled: boolean;
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
        address_line1: string;
        address_line2: string;
        city: string;
        province: string;
        country: string;
        services: Row[];
        stats: Row[];
        social_links: Record<string, string>;
        registration_enabled: boolean;
    }>({
        agency_name: settings.agency_name ?? '',
        tagline: settings.tagline ?? '',
        agency_story: settings.agency_story ?? '',
        mission: settings.mission ?? '',
        vision: settings.vision ?? '',
        fifa_license_info: settings.fifa_license_info ?? '',
        email: settings.email ?? '',
        phone: settings.phone ?? '',
        address_line1: settings.address_line1 ?? '',
        address_line2: settings.address_line2 ?? '',
        city: settings.city ?? '',
        province: settings.province ?? '',
        country: settings.country ?? '',
        services: settings.services ?? [],
        stats: settings.stats ?? [],
        social_links: socialKeys.reduce<Record<string, string>>((acc, key) => {
            acc[key] = settings.social_links?.[key] ?? '';
            return acc;
        }, {}),
        registration_enabled: settings.registration_enabled ?? false,
    });

    const { data, setData, errors, processing } = form;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put('/admin/site-settings', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Site Settings" />

            <form onSubmit={submit}>
                <AdminPage>
                    <PageHeader title="Site Settings" description="Content shared across the public website">
                        <Button type="submit" disabled={processing}>Save settings</Button>
                    </PageHeader>

                    <div className="space-y-10">
                        <FormSection title="Agency" description="Your identity and story shown across the site.">
                            <Field label="Agency name" htmlFor="agency_name" required error={errors.agency_name}>
                                <Input id="agency_name" value={data.agency_name} onChange={(e) => setData('agency_name', e.target.value)} required />
                            </Field>
                            <Field label="Tagline" htmlFor="tagline" error={errors.tagline}>
                                <Input id="tagline" value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
                            </Field>
                            <Field label="Agency story" htmlFor="agency_story" error={errors.agency_story}>
                                <Textarea id="agency_story" rows={6} value={data.agency_story} onChange={(e) => setData('agency_story', e.target.value)} />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Mission" htmlFor="mission" error={errors.mission}>
                                    <Textarea id="mission" rows={3} value={data.mission} onChange={(e) => setData('mission', e.target.value)} />
                                </Field>
                                <Field label="Vision" htmlFor="vision" error={errors.vision}>
                                    <Textarea id="vision" rows={3} value={data.vision} onChange={(e) => setData('vision', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="FIFA licence info" htmlFor="fifa_license_info" error={errors.fifa_license_info}>
                                <Input id="fifa_license_info" value={data.fifa_license_info} onChange={(e) => setData('fifa_license_info', e.target.value)} />
                            </Field>
                        </FormSection>

                        <FormSection title="Contact" description="How visitors reach the agency.">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Email" htmlFor="email" error={errors.email}>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                </Field>
                                <Field label="Phone" htmlFor="phone" error={errors.phone}>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                </Field>
                            </div>

                            <Field label="Address line 1" htmlFor="address_line1" error={errors.address_line1}>
                                <Input id="address_line1" value={data.address_line1} onChange={(e) => setData('address_line1', e.target.value)} />
                            </Field>
                            <Field label="Address line 2" htmlFor="address_line2" hint="Optional" error={errors.address_line2}>
                                <Input id="address_line2" value={data.address_line2} onChange={(e) => setData('address_line2', e.target.value)} />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-3">
                                <Field label="City" htmlFor="city" error={errors.city}>
                                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                </Field>
                                <Field label="Province / State" htmlFor="province" error={errors.province}>
                                    <Input id="province" value={data.province} onChange={(e) => setData('province', e.target.value)} />
                                </Field>
                                <Field label="Country" htmlFor="country" error={errors.country}>
                                    <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                                </Field>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {socialKeys.map((key) => (
                                    <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} htmlFor={`social_${key}`}>
                                        <Input
                                            id={`social_${key}`}
                                            value={data.social_links[key] ?? ''}
                                            onChange={(e) => setData('social_links', { ...data.social_links, [key]: e.target.value })}
                                            placeholder="https://"
                                        />
                                    </Field>
                                ))}
                            </div>
                        </FormSection>

                        <FormSection title="Homepage" description="Services and stats shown on the homepage.">
                            <Repeater
                                label="Services"
                                rows={data.services}
                                onChange={(rows) => setData('services', rows)}
                                fields={[
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
                        </FormSection>

                        <FormSection title="Security" description="Control who can create an account.">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="registration_enabled"
                                    checked={data.registration_enabled}
                                    onCheckedChange={(checked) => setData('registration_enabled', checked === true)}
                                />
                                <div className="grid gap-1">
                                    <Label htmlFor="registration_enabled">Allow new admin registration</Label>
                                    <p className="text-sm text-muted-foreground">
                                        When off, the public sign-up page is disabled. Existing admins can still create new admin accounts
                                        from the Admins page.
                                    </p>
                                </div>
                            </div>
                        </FormSection>
                    </div>

                    <FormActions>
                        <Button type="submit" disabled={processing}>Save settings</Button>
                    </FormActions>
                </AdminPage>
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
