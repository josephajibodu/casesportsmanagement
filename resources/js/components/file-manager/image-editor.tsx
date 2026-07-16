import {
    FlipHorizontal,
    FlipVertical,
    RotateCcw,
    RotateCw,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';
import { NativeSelect } from '@/components/admin/native-select';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { blobToFile, renderCroppedImage, type PixelCrop } from './crop-image';

const ASPECTS: { label: string; value: number | undefined }[] = [
    { label: 'Free', value: undefined },
    { label: '1:1', value: 1 },
    { label: '16:9', value: 16 / 9 },
    { label: '4:3', value: 4 / 3 },
];

const QUALITIES = [1, 0.9, 0.8, 0.7];

/**
 * Optional pre-upload editing for images: crop, rotate, flip, resize and
 * compress. Returns a brand new File to the caller.
 */
export function ImageEditor({
    file,
    open,
    onCancel,
    onApply,
}: {
    file: File | null;
    open: boolean;
    onCancel: () => void;
    onApply: (edited: File) => void;
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [customAspect, setCustomAspect] = useState({ w: '', h: '' });
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });
    const [quality, setQuality] = useState(0.9);
    const [pixels, setPixels] = useState<PixelCrop | null>(null);
    const [dimensions, setDimensions] = useState({ width: '', height: '' });
    const [lockRatio, setLockRatio] = useState(true);
    const [processing, setProcessing] = useState(false);

    const src = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);

    // Reset whenever a new file is opened.
    useEffect(() => {
        if (open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setAspect(undefined);
            setFlip({ horizontal: false, vertical: false });
            setQuality(0.9);
            setDimensions({ width: '', height: '' });
            setLockRatio(true);
        }
    }, [open, file]);

    const onCropComplete = useCallback((_: unknown, areaPixels: PixelCrop) => {
        setPixels(areaPixels);
        setDimensions((prev) =>
            prev.width === '' ? { width: String(Math.round(areaPixels.width)), height: String(Math.round(areaPixels.height)) } : prev,
        );
    }, []);

    const cropRatio = pixels && pixels.height ? pixels.width / pixels.height : 1;

    function changeWidth(value: string) {
        setDimensions((prev) => ({
            width: value,
            height: lockRatio && value ? String(Math.round(Number(value) / cropRatio)) : prev.height,
        }));
    }

    function changeHeight(value: string) {
        setDimensions((prev) => ({
            width: lockRatio && value ? String(Math.round(Number(value) * cropRatio)) : prev.width,
            height: value,
        }));
    }

    function applyCustomAspect() {
        const w = Number(customAspect.w);
        const h = Number(customAspect.h);
        if (w > 0 && h > 0) setAspect(w / h);
    }

    async function apply() {
        if (!file || !src || !pixels) return;

        setProcessing(true);
        try {
            const mimeType = file.type === 'image/png' && quality === 1 ? 'image/png' : 'image/jpeg';
            const blob = await renderCroppedImage(src, pixels, {
                rotation,
                flip,
                quality,
                mimeType,
                width: dimensions.width ? Number(dimensions.width) : undefined,
                height: dimensions.height ? Number(dimensions.height) : undefined,
            });

            onApply(blobToFile(blob, file.name, mimeType));
        } finally {
            setProcessing(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit image</DialogTitle>
                    <DialogDescription>Crop, rotate, resize and compress before uploading.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                    {/* Live preview */}
                    <div className="relative h-[380px] overflow-hidden rounded-lg bg-muted">
                        {src && (
                            <Cropper
                                image={src}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspect}
                                transform={[
                                    `translate(${crop.x}px, ${crop.y}px)`,
                                    `rotateZ(${rotation}deg)`,
                                    `rotateY(${flip.horizontal ? 180 : 0}deg)`,
                                    `rotateX(${flip.vertical ? 180 : 0}deg)`,
                                    `scale(${zoom})`,
                                ].join(' ')}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>

                    <div className="space-y-4 overflow-y-auto lg:max-h-[380px]">
                        <div className="grid gap-2">
                            <Label>Crop ratio</Label>
                            <div className="flex flex-wrap gap-1.5">
                                {ASPECTS.map((option) => (
                                    <Button
                                        key={option.label}
                                        type="button"
                                        size="sm"
                                        variant={aspect === option.value ? 'default' : 'outline'}
                                        onClick={() => setAspect(option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Input
                                    value={customAspect.w}
                                    onChange={(e) => setCustomAspect((p) => ({ ...p, w: e.target.value }))}
                                    placeholder="W"
                                    className="h-8"
                                    inputMode="numeric"
                                />
                                <span className="text-muted-foreground">:</span>
                                <Input
                                    value={customAspect.h}
                                    onChange={(e) => setCustomAspect((p) => ({ ...p, h: e.target.value }))}
                                    placeholder="H"
                                    className="h-8"
                                    inputMode="numeric"
                                />
                                <Button type="button" size="sm" variant="outline" onClick={applyCustomAspect}>
                                    Set
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="zoom">Zoom</Label>
                            <input
                                id="zoom"
                                type="range"
                                min={1}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Rotate and flip</Label>
                            <div className="flex flex-wrap gap-1.5">
                                <Button type="button" size="icon" variant="outline" onClick={() => setRotation((r) => r - 90)} aria-label="Rotate left">
                                    <RotateCcw className="size-4" />
                                </Button>
                                <Button type="button" size="icon" variant="outline" onClick={() => setRotation((r) => r + 90)} aria-label="Rotate right">
                                    <RotateCw className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant={flip.horizontal ? 'default' : 'outline'}
                                    onClick={() => setFlip((f) => ({ ...f, horizontal: !f.horizontal }))}
                                    aria-label="Flip horizontal"
                                >
                                    <FlipHorizontal className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant={flip.vertical ? 'default' : 'outline'}
                                    onClick={() => setFlip((f) => ({ ...f, vertical: !f.vertical }))}
                                    aria-label="Flip vertical"
                                >
                                    <FlipVertical className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Resize</Label>
                            <div className="flex items-center gap-1.5">
                                <Input value={dimensions.width} onChange={(e) => changeWidth(e.target.value)} placeholder="Width" className="h-8" inputMode="numeric" />
                                <span className="text-muted-foreground">×</span>
                                <Input value={dimensions.height} onChange={(e) => changeHeight(e.target.value)} placeholder="Height" className="h-8" inputMode="numeric" />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="size-3.5" />
                                Maintain aspect ratio
                            </label>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quality">Quality</Label>
                            <NativeSelect id="quality" value={String(quality)} onChange={(e) => setQuality(Number(e.target.value))}>
                                {QUALITIES.map((q) => (
                                    <option key={q} value={q}>
                                        {Math.round(q * 100)}%
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={apply} disabled={processing || !pixels}>
                        <span className={cn(processing && 'opacity-70')}>{processing ? 'Processing…' : 'Apply changes'}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
