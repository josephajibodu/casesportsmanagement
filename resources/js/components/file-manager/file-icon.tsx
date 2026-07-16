import { File, FileText, Film, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaFileType } from './types';

const ICONS = {
    image: ImageIcon,
    video: Film,
    document: FileText,
    other: File,
} as const;

const COLORS = {
    image: 'text-emerald-500',
    video: 'text-violet-500',
    document: 'text-amber-500',
    other: 'text-muted-foreground',
} as const;

export function FileIcon({ type, className }: { type: MediaFileType; className?: string }) {
    const Icon = ICONS[type] ?? File;

    return <Icon className={cn('size-5', COLORS[type], className)} />;
}
