import { ChevronRight, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaFolder } from './types';

export function Breadcrumbs({
    trail,
    onNavigate,
    onDropFile,
}: {
    trail: MediaFolder[];
    onNavigate: (id: number | null) => void;
    onDropFile?: (fileId: number, folderId: number | null) => void;
}) {
    function dropProps(folderId: number | null) {
        if (!onDropFile) return {};

        return {
            onDragOver: (e: React.DragEvent) => {
                if (e.dataTransfer.types.includes('application/x-media-file')) e.preventDefault();
            },
            onDrop: (e: React.DragEvent) => {
                const id = e.dataTransfer.getData('application/x-media-file');
                if (id) {
                    e.preventDefault();
                    onDropFile(Number(id), folderId);
                }
            },
        };
    }

    return (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
            <button
                type="button"
                onClick={() => onNavigate(null)}
                {...dropProps(null)}
                className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-accent',
                    trail.length === 0 ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
            >
                <HardDrive className="size-4" />
                All files
            </button>

            {trail.map((folder, index) => {
                const isLast = index === trail.length - 1;

                return (
                    <span key={folder.id} className="flex min-w-0 items-center">
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
                        <button
                            type="button"
                            onClick={() => onNavigate(folder.id)}
                            {...dropProps(folder.id)}
                            className={cn(
                                'truncate rounded-md px-2 py-1 transition hover:bg-accent',
                                isLast ? 'font-medium text-foreground' : 'text-muted-foreground',
                            )}
                        >
                            {folder.name}
                        </button>
                    </span>
                );
            })}
        </nav>
    );
}
