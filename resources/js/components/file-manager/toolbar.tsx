import { ArrowDownUp, FolderPlus, Grid3x3, List, RefreshCw, Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { SortDirection, SortKey, ViewMode } from './types';

const SORTS: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'created_at', label: 'Date uploaded' },
    { key: 'size', label: 'Size' },
    { key: 'extension', label: 'File type' },
];

export function Toolbar({
    search,
    onSearch,
    onNewFolder,
    onUpload,
    onRefresh,
    view,
    onViewChange,
    sort,
    direction,
    onSortChange,
    onDirectionChange,
    loading,
}: {
    search: string;
    onSearch: (value: string) => void;
    onNewFolder: () => void;
    onUpload: () => void;
    onRefresh: () => void;
    view: ViewMode;
    onViewChange: (view: ViewMode) => void;
    sort: SortKey;
    direction: SortDirection;
    onSortChange: (sort: SortKey) => void;
    onDirectionChange: (direction: SortDirection) => void;
    loading?: boolean;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search files and folders"
                    className="pl-8"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowDownUp className="size-4" /> Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        {SORTS.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.key}
                                checked={sort === option.key}
                                onCheckedChange={() => onSortChange(option.key)}
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={direction === 'asc'}
                            onCheckedChange={() => onDirectionChange('asc')}
                        >
                            Ascending
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={direction === 'desc'}
                            onCheckedChange={() => onDirectionChange('desc')}
                        >
                            Descending
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center rounded-md border p-0.5">
                    <button
                        type="button"
                        onClick={() => onViewChange('grid')}
                        aria-label="Grid view"
                        className={cn('rounded p-1.5 transition', view === 'grid' ? 'bg-accent' : 'text-muted-foreground')}
                    >
                        <Grid3x3 className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onViewChange('list')}
                        aria-label="List view"
                        className={cn('rounded p-1.5 transition', view === 'list' ? 'bg-accent' : 'text-muted-foreground')}
                    >
                        <List className="size-4" />
                    </button>
                </div>

                <Button variant="outline" size="icon" onClick={onRefresh} aria-label="Refresh">
                    <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
                </Button>

                <Button variant="outline" size="sm" onClick={onNewFolder}>
                    <FolderPlus className="size-4" /> New folder
                </Button>

                <Button size="sm" onClick={onUpload}>
                    <Upload className="size-4" /> Upload
                </Button>
            </div>
        </div>
    );
}
