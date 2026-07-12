import { useState } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

export function ImageUpload({
    label,
    currentUrl,
    error,
    onFile,
    hint,
}: {
    label: string;
    currentUrl?: string | null;
    error?: string;
    onFile: (file: File | null) => void;
    hint?: string;
}) {
    const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        onFile(file);
        setPreview(file ? URL.createObjectURL(file) : (currentUrl ?? null));
    }

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/40">
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt="" className="size-full object-cover" />
                    ) : (
                        <span className="text-xs text-muted-foreground">No image</span>
                    )}
                </div>
                <div className="grid gap-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent"
                    />
                    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
                </div>
            </div>
            <InputError message={error} />
        </div>
    );
}
