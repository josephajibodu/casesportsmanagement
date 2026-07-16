import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { MediaFolder } from './types';

export function FolderCard({
    folder,
    view,
    onOpen,
    onRename,
    onDelete,
    onDropFile,
}: {
    folder: MediaFolder;
    view: 'grid' | 'list';
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
    onDropFile?: (fileId: number) => void;
}) {
    const [isOver, setIsOver] = useState(false);

    /** Accept files dragged from the grid/list to move them into this folder. */
    const dropProps = onDropFile
        ? {
              onDragOver: (e: React.DragEvent) => {
                  if (e.dataTransfer.types.includes('application/x-media-file')) {
                      e.preventDefault();
                      setIsOver(true);
                  }
              },
              onDragLeave: () => setIsOver(false),
              onDrop: (e: React.DragEvent) => {
                  const id = e.dataTransfer.getData('application/x-media-file');
                  setIsOver(false);
                  if (id) {
                      e.preventDefault();
                      onDropFile(Number(id));
                  }
              },
          }
        : {};

    const menu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRename}>
                    <Pencil className="size-4" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    if (view === 'list') {
        return (
            <tr
                {...dropProps}
                onDoubleClick={onOpen}
                className={cn('cursor-pointer border-b transition hover:bg-accent/40', isOver && 'bg-primary/10')}
            >
                <td className="px-3 py-2">
                    <button type="button" onClick={onOpen} className="flex items-center gap-3 text-left">
                        <Folder className="size-5 shrink-0 fill-primary/20 text-primary" />
                        <span className="font-medium">{folder.name}</span>
                    </button>
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground">Folder</td>
                <td className="px-3 py-2 text-sm text-muted-foreground">
                    {folder.files_count ?? 0} {folder.files_count === 1 ? 'file' : 'files'}
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground">—</td>
                <td className="px-3 py-2 text-right">{menu}</td>
            </tr>
        );
    }

    return (
        <div
            {...dropProps}
            onDoubleClick={onOpen}
            className={cn(
                'group relative flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 transition hover:border-primary/40 hover:bg-accent/40',
                isOver && 'border-primary bg-primary/10 ring-2 ring-primary/30',
            )}
        >
            <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <Folder className="size-8 shrink-0 fill-primary/20 text-primary" />
                <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{folder.name}</span>
                    <span className="block text-xs text-muted-foreground">
                        {folder.files_count ?? 0} {folder.files_count === 1 ? 'file' : 'files'}
                    </span>
                </span>
            </button>
            <div className="opacity-0 transition group-hover:opacity-100">{menu}</div>
        </div>
    );
}
