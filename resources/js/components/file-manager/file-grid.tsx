import { Skeleton } from '@/components/ui/skeleton';
import { FileCard, type FileCardActions } from './file-card';
import { FolderCard } from './folder-card';
import type { MediaFile, MediaFolder } from './types';

/*
 * Container queries, not viewport breakpoints.
 *
 * The browser renders at very different widths depending on where it lives: the
 * full-width page, or the picker modal minus its sidebar. Sizing off the
 * viewport (sm:/lg:/xl:) gave five columns inside a narrow modal and squashed
 * every card until the names truncated away. `@container` on the scroll area
 * makes the columns track the space actually available.
 */
const FILE_GRID = 'grid grid-cols-2 gap-3 @md:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5';
const FOLDER_GRID = 'grid grid-cols-1 gap-3 @xs:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4';

export type BrowserProps = {
    folders: MediaFolder[];
    files: MediaFile[];
    loading: boolean;
    selectedIds: number[];
    isSelectable: (file: MediaFile) => boolean;
    onOpenFolder: (id: number) => void;
    onRenameFolder: (folder: MediaFolder) => void;
    onDeleteFolder: (folder: MediaFolder) => void;
    onDropFileInFolder: (fileId: number, folderId: number) => void;
    onSelectFile: (file: MediaFile) => void;
    fileActions: FileCardActions;
};

export function FileGrid({
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
}: BrowserProps) {
    if (loading) {
        return (
            <div className={FILE_GRID}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {folders.length > 0 && (
                <div>
                    <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase">Folders</h3>
                    <div className={FOLDER_GRID}>
                        {folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                view="grid"
                                onOpen={() => onOpenFolder(folder.id)}
                                onRename={() => onRenameFolder(folder)}
                                onDelete={() => onDeleteFolder(folder)}
                                onDropFile={(fileId) => onDropFileInFolder(fileId, folder.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <div>
                    {folders.length > 0 && <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase">Files</h3>}
                    <div className={FILE_GRID}>
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                view="grid"
                                selected={selectedIds.includes(file.id)}
                                selectable={isSelectable(file)}
                                onSelect={onSelectFile}
                                actions={fileActions}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
