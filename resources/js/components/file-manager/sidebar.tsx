import { Clock, FileText, Film, HardDrive, Image as ImageIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TypeFilter } from './types';

const FILTERS: { key: TypeFilter; label: string; icon: LucideIcon }[] = [
    { key: null, label: 'All files', icon: HardDrive },
    { key: 'image', label: 'Images', icon: ImageIcon },
    { key: 'document', label: 'Documents', icon: FileText },
    { key: 'video', label: 'Videos', icon: Film },
    { key: 'recent', label: 'Recent', icon: Clock },
];

/**
 * Left rail of the File Manager. Selecting a type switches to a flat view of
 * every matching file; "All files" returns to folder browsing.
 */
export function FileManagerSidebar({
    active,
    onSelect,
    className,
}: {
    active: TypeFilter;
    onSelect: (filter: TypeFilter) => void;
    className?: string;
}) {
    return (
        <nav className={cn('space-y-0.5', className)}>
            {FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isActive = active === filter.key;

                return (
                    <button
                        key={filter.label}
                        type="button"
                        onClick={() => onSelect(filter.key)}
                        className={cn(
                            'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                            isActive
                                ? 'bg-primary/10 font-medium text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4 shrink-0" />
                        {filter.label}
                    </button>
                );
            })}
        </nav>
    );
}
