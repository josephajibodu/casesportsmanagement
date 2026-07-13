import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Full-width page container with consistent padding. */
export function AdminPage({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8', className)}>{children}</div>;
}

/** Page header: title, description, and optional right-aligned actions. */
export function PageHeader({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    );
}

/**
 * Filament-style section: heading/description in an aside column,
 * fields in a card beside it.
 */
export function FormSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="grid gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-1">
                <h2 className="text-base font-semibold">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="lg:col-span-2">
                <div className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">{children}</div>
            </div>
        </section>
    );
}

/** A labelled form control with optional hint + error. */
export function Field({
    label,
    htmlFor,
    error,
    required,
    hint,
    className,
    children,
}: {
    label?: string;
    htmlFor?: string;
    error?: string;
    required?: boolean;
    hint?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn('grid gap-2', className)}>
            {label && (
                <Label htmlFor={htmlFor}>
                    {label}
                    {required && <span className="ml-0.5 text-destructive">*</span>}
                </Label>
            )}
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            <InputError message={error} />
        </div>
    );
}

/** Sticky action bar pinned to the bottom of a form. */
export function FormActions({ children }: { children: ReactNode }) {
    return (
        <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex items-center gap-3 border-t bg-background/85 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
            {children}
        </div>
    );
}
