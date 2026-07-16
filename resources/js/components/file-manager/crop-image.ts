export type PixelCrop = { x: number; y: number; width: number; height: number };
export type Flip = { horizontal: boolean; vertical: boolean };

export type RenderOptions = {
    rotation?: number;
    flip?: Flip;
    /** Final output size. Omit to keep the cropped size. */
    width?: number;
    height?: number;
    /** 0..1, only honoured by lossy formats. */
    quality?: number;
    mimeType?: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('Could not load the image.')));
        image.src = src;
    });
}

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/** Bounding box of an image after it has been rotated. */
function rotatedSize(width: number, height: number, rotation: number) {
    const radians = toRadians(rotation);

    return {
        width: Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height),
        height: Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height),
    };
}

/**
 * Applies crop, rotation, flip, resize and compression to an image and returns
 * the result as a Blob. Runs entirely in the browser before upload.
 */
export async function renderCroppedImage(
    imageSrc: string,
    crop: PixelCrop,
    options: RenderOptions = {},
): Promise<Blob> {
    const { rotation = 0, flip = { horizontal: false, vertical: false }, quality = 0.9 } = options;
    const mimeType = options.mimeType ?? 'image/jpeg';

    const image = await loadImage(imageSrc);

    // 1. Draw the whole image rotated/flipped onto a working canvas.
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available.');

    const box = rotatedSize(image.width, image.height, rotation);
    canvas.width = box.width;
    canvas.height = box.height;

    ctx.translate(box.width / 2, box.height / 2);
    ctx.rotate(toRadians(rotation));
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    // 2. Cut out the crop region.
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) throw new Error('Canvas is not available.');

    cropCanvas.width = Math.max(1, Math.round(crop.width));
    cropCanvas.height = Math.max(1, Math.round(crop.height));
    cropCtx.drawImage(
        canvas,
        Math.round(crop.x),
        Math.round(crop.y),
        cropCanvas.width,
        cropCanvas.height,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height,
    );

    // 3. Resize to the requested output dimensions.
    const targetWidth = Math.max(1, Math.round(options.width ?? cropCanvas.width));
    const targetHeight = Math.max(1, Math.round(options.height ?? cropCanvas.height));

    let output = cropCanvas;
    if (targetWidth !== cropCanvas.width || targetHeight !== cropCanvas.height) {
        const resized = document.createElement('canvas');
        const resizedCtx = resized.getContext('2d');
        if (!resizedCtx) throw new Error('Canvas is not available.');

        resized.width = targetWidth;
        resized.height = targetHeight;
        resizedCtx.imageSmoothingQuality = 'high';
        resizedCtx.drawImage(cropCanvas, 0, 0, targetWidth, targetHeight);
        output = resized;
    }

    return new Promise((resolve, reject) => {
        output.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Could not process the image.'))),
            mimeType,
            quality,
        );
    });
}

/** Replace a file's extension so an edited PNG saved as JPEG stays consistent. */
export function blobToFile(blob: Blob, originalName: string, mimeType: string): File {
    const base = originalName.replace(/\.[^.]+$/, '');
    const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';

    return new File([blob], `${base}.${extension}`, { type: mimeType });
}
