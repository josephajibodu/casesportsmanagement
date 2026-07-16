import { ArrowDown, ArrowUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { FileCard } from './file-card';
import type { BrowserProps } from './file-grid';
import { FolderCard } from './folder-card';
import type { SortDirection, SortKey } from './types';

type Props = BrowserProps & {
    sort: SortKey;
    direction: SortDirection;
    onToggleSort: (key: SortKey) => void;
};

const COLUMNS: { key: SortKey | null; label: string; className?: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'extension', label: 'Type' },
    { key: 'size', label: 'Size' },
    { key: 'created_at', label: 'Uploaded' },
    { key: null, label: '', className: 'text-right' },
];

export function FileList({
    folders,
    files,
    loading,
    selectedIds,
    isSelectable,
    onOpenFolder,
    onRenameFolder,
    onDeleteFolder,
    onDropFileInFolder,
    onSelectFile,
    fileActions,
    sort,
    direction,
    onToggleSort,
}: Props) {
    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground uppercase">
                    <tr>
                        {COLUMNS.map((column) => (
                            <th key={column.label} className={cn('px-3 py-2 font-medium', column.className)}>
                                {column.key ? (
                                    <button
                                        type="button"
                                        onClick={() => onToggleSort(column.key as SortKey)}
                                        className="inline-flex items-center gap-1 hover:text-foreground"
                                    >
                                        {column.label}
                                        {sort === column.key &&
                                            (direction === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
                                    </button>
                                ) : (
                                    column.label
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {folders.map((folder) => (
                        <FolderCard
                            key={`folder-${folder.id}`}
                            folder={folder}
                            view="list"
                            onOpen={() => onOpenFolder(folder.id)}
                            onRename={() => onRenameFolder(folder)}
                            onDelete={() => onDeleteFolder(folder)}
                            onDropFile={(fileId) => onDropFileInFolder(fileId, folder.id)}
                        />
                    ))}
                    {files.map((file) => (
                        <FileCard
                            key={`file-${file.id}`}
                            file={file}
                            view="list"
                            selected={selectedIds.includes(file.id)}
                            selectable={isSelectable(file)}
                            onSelect={onSelectFile}
                            actions={fileActions}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
