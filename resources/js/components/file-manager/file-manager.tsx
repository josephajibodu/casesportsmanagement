import { FolderOpen, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from './breadcrumbs';
import { ConfirmDialog, MoveDialog, PromptDialog } from './dialogs';
import type { FileCardActions } from './file-card';
import { FileGrid } from './file-grid';
import { FileList } from './file-list';
import { FilePreview } from './file-preview';
import { FileManagerSidebar } from './sidebar';
import { copyToClipboard, ShareDialog } from './share-dialog';
import { Toolbar } from './toolbar';
import type { MediaFile, MediaFolder } from './types';
import { UploadPanel } from './upload-panel';
import type { FileManagerController } from './use-file-manager';

export function FileManager({
    fm,
    accept,
    selectedIds = [],
    onFileClick,
    onUploadRequest,
    showSidebar = true,
    className,
    contentClassName,
}: {
    /** Created by the caller with useFileManager so state survives re-renders. */
    fm: FileManagerController;
    accept?: string[];
    selectedIds?: number[];
    /** Defaults to opening the preview. The picker overrides this to select. */
    onFileClick?: (file: MediaFile) => void;
    /** When set, the toolbar's Upload button defers to the caller (modal tab). */
    onUploadRequest?: () => void;
    showSidebar?: boolean;
    className?: string;
    contentClassName?: string;
}) {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const [dragging, setDragging] = useState(false);

    const [preview, setPreview] = useState<MediaFile | null>(null);
    const [sharing, setSharing] = useState<MediaFile | null>(null);
    const [renamingFile, setRenamingFile] = useState<MediaFile | null>(null);
    const [movingFile, setMovingFile] = useState<MediaFile | null>(null);
    const [deletingFile, setDeletingFile] = useState<MediaFile | null>(null);
    const [renamingFolder, setRenamingFolder] = useState<MediaFolder | null>(null);
    const [deletingFolder, setDeletingFolder] = useState<MediaFolder | null>(null);
    const [newFolderOpen, setNewFolderOpen] = useState(false);

    const fileActions: FileCardActions = {
        onPreview: setPreview,
        onRename: setRenamingFile,
        onMove: setMovingFile,
        onShare: setSharing,
        onCopyLink: (file) => file.share_url && copyToClipboard(file.share_url),
        onDelete: setDeletingFile,
    };

    function handleUploadClick() {
        if (onUploadRequest) {
            onUploadRequest();
            return;
        }
        setDroppedFiles([]);
        setUploadOpen(true);
    }

    /** Native files dropped anywhere on the browser open the upload panel. */
    function handleDrop(e: React.DragEvent) {
        if (!e.dataTransfer.types.includes('Files')) return;

        e.preventDefault();
        setDragging(false);
        setDroppedFiles(Array.from(e.dataTransfer.files));
        setUploadOpen(true);
    }

    const isEmpty = !fm.loading && fm.folders.length === 0 && fm.files.length === 0;

    const browserProps = {
        folders: fm.folders,
        files: fm.files,
        loading: fm.loading,
        selectedIds,
        isSelectable: fm.isSelectable,
        onOpenFolder: fm.openFolder,
        onRenameFolder: setRenamingFolder,
        onDeleteFolder: setDeletingFolder,
        onDropFileInFolder: (fileId: number, folderId: number) => {
            const file = fm.files.find((f) => f.id === fileId);
            if (file) fm.moveFile(file, folderId);
        },
        onSelectFile: onFileClick ?? setPreview,
        fileActions,
    };

    return (
        <div className={cn('flex min-h-0 flex-col gap-4', className)}>
            <Toolbar
                search={fm.search}
                onSearch={fm.setSearch}
                onNewFolder={() => setNewFolderOpen(true)}
                onUpload={handleUploadClick}
                onRefresh={fm.refresh}
                view={fm.view}
                onViewChange={fm.setView}
                sort={fm.sort}
                direction={fm.direction}
                onSortChange={fm.setSort}
                onDirectionChange={fm.setDirection}
                loading={fm.loading}
            />

            <div className="flex min-h-0 flex-1 gap-4">
                {showSidebar && (
                    <FileManagerSidebar
                        active={fm.typeFilter}
                        onSelect={(filter) => {
                            fm.setTypeFilter(filter);
                            if (filter === null) fm.openFolder(null);
                        }}
                        className="hidden w-44 shrink-0 md:block"
                    />
                )}

                <div
                    onDragOver={(e) => {
                        if (e.dataTransfer.types.includes('Files')) {
                            e.preventDefault();
                            setDragging(true);
                        }
                    }}
                    onDragLeave={(e) => {
                        if (e.currentTarget === e.target) setDragging(false);
                    }}
                    onDrop={handleDrop}
                    className={cn(
                        'relative flex min-w-0 flex-1 flex-col gap-3 rounded-xl transition',
                        dragging && 'ring-2 ring-primary ring-offset-2',
                    )}
                >
                    {!fm.typeFilter && (
                        <Breadcrumbs
                            trail={fm.breadcrumbs}
                            onNavigate={fm.openFolder}
                            onDropFile={(fileId, folderId) => {
                                const file = fm.files.find((f) => f.id === fileId);
                                if (file) fm.moveFile(file, folderId);
                            }}
                        />
                    )}

                    {dragging && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/5">
                            <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium shadow">
                                <Upload className="size-4" /> Drop to upload
                            </div>
                        </div>
                    )}

                    {/* @container: the grids size their columns off this element's
                        width rather than the viewport's, so they stay correct in
                        both the full-width page and the narrower picker modal. */}
                    <div className={cn('@container min-h-0 flex-1', contentClassName)}>
                        {isEmpty ? (
                            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center">
                                <FolderOpen className="size-10 text-muted-foreground/50" />
                                <p className="mt-3 text-sm font-medium">
                                    {fm.search ? 'No matching files' : 'This folder is empty'}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {fm.search ? 'Try a different search.' : 'Drop files here or use the Upload button.'}
                                </p>
                                {!fm.search && (
                                    <Button size="sm" className="mt-4" onClick={handleUploadClick}>
                                        <Upload className="size-4" /> Upload files
                                    </Button>
                                )}
                            </div>
                        ) : fm.view === 'grid' ? (
                            <FileGrid {...browserProps} />
                        ) : (
                            <FileList {...browserProps} sort={fm.sort} direction={fm.direction} onToggleSort={fm.toggleSort} />
                        )}
                    </div>
                </div>
            </div>

            {/* Upload (page mode) */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Upload files</DialogTitle>
                    </DialogHeader>
                    <UploadPanel
                        folderId={fm.folderId}
                        accept={accept}
                        initialFiles={droppedFiles}
                        onUploaded={fm.addUploadedFile}
                    />
                </DialogContent>
            </Dialog>

            <FilePreview file={preview} files={fm.files} onClose={() => setPreview(null)} onNavigate={setPreview} />

            <ShareDialog
                file={sharing}
                onClose={() => setSharing(null)}
                onUpdated={(file) => {
                    fm.replaceFile(file);
                    setSharing(file);
                }}
            />

            <PromptDialog
                open={newFolderOpen}
                title="New folder"
                label="Folder name"
                confirmLabel="Create"
                onCancel={() => setNewFolderOpen(false)}
                onConfirm={(name) => {
                    fm.createFolder(name);
                    setNewFolderOpen(false);
                }}
            />

            <PromptDialog
                open={!!renamingFile}
                title="Rename file"
                label="Name"
                initialValue={renamingFile?.name ?? ''}
                onCancel={() => setRenamingFile(null)}
                onConfirm={(name) => {
                    if (renamingFile) fm.renameFile(renamingFile, name);
                    setRenamingFile(null);
                }}
            />

            <PromptDialog
                open={!!renamingFolder}
                title="Rename folder"
                label="Folder name"
                initialValue={renamingFolder?.name ?? ''}
                onCancel={() => setRenamingFolder(null)}
                onConfirm={(name) => {
                    if (renamingFolder) fm.renameFolder(renamingFolder, name);
                    setRenamingFolder(null);
                }}
            />

            <MoveDialog
                open={!!movingFile}
                currentFolderId={movingFile?.folder_id ?? null}
                onCancel={() => setMovingFile(null)}
                onMove={(folderId) => {
                    if (movingFile) fm.moveFile(movingFile, folderId);
                    setMovingFile(null);
                }}
            />

            <ConfirmDialog
                open={!!deletingFile}
                title={`Delete “${deletingFile?.name}”?`}
                description="The file will be permanently removed from storage. Anything using it will lose the reference."
                onCancel={() => setDeletingFile(null)}
                onConfirm={() => {
                    if (deletingFile) fm.deleteFile(deletingFile);
                    setDeletingFile(null);
                }}
            />

            <ConfirmDialog
                open={!!deletingFolder}
                title={`Delete “${deletingFolder?.name}”?`}
                description="This folder, everything inside it, and all nested folders will be permanently deleted."
                onCancel={() => setDeletingFolder(null)}
                onConfirm={() => {
                    if (deletingFolder) fm.deleteFolder(deletingFolder);
                    setDeletingFolder(null);
                }}
            />
        </div>
    );
}
