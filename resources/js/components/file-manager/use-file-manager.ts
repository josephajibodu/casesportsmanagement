import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { fileManagerApi } from './api';
import type { MediaFile, MediaFolder, SortDirection, SortKey, TypeFilter, ViewMode } from './types';

const VIEW_STORAGE_KEY = 'file-manager:view';

function storedView(): ViewMode {
    if (typeof window === 'undefined') return 'grid';

    return (localStorage.getItem(VIEW_STORAGE_KEY) as ViewMode | null) ?? 'grid';
}

/**
 * All File Manager state and actions. Shared by the standalone page and the
 * picker modal so both behave identically.
 */
export function useFileManager({ accept }: { accept?: string[] } = {}) {
    const [folderId, setFolderId] = useState<number | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<MediaFolder[]>([]);
    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [files, setFiles] = useState<MediaFile[]>([]);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>(null);
    const [sort, setSort] = useState<SortKey>('created_at');
    const [direction, setDirection] = useState<SortDirection>('desc');
    const [view, setViewState] = useState<ViewMode>(storedView);

    const [loading, setLoading] = useState(true);
    const requestRef = useRef<AbortController | null>(null);

    const setView = useCallback((next: ViewMode) => {
        setViewState(next);
        localStorage.setItem(VIEW_STORAGE_KEY, next);
    }, []);

    const refresh = useCallback(async () => {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;

        setLoading(true);
        try {
            const data = await fileManagerApi.browse({
                folderId,
                search,
                type: typeFilter,
                sort,
                direction,
                signal: controller.signal,
            });

            setBreadcrumbs(data.breadcrumbs);
            setFolders(data.folders);
            setFiles(data.files);
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                toast.error('Could not load files.');
            }
            return;
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [folderId, search, typeFilter, sort, direction]);

    // Debounce search, fetch immediately for everything else.
    useEffect(() => {
        const delay = search ? 250 : 0;
        const timer = setTimeout(refresh, delay);

        return () => clearTimeout(timer);
    }, [refresh, search]);

    /** Files the caller is allowed to select, given an `accept` restriction. */
    const isSelectable = useCallback(
        (file: MediaFile) => {
            if (!accept?.length) return true;

            return accept.some((rule) => {
                const value = rule.toLowerCase();
                if (value.endsWith('/*')) return (file.mime_type ?? '').startsWith(value.slice(0, -1));
                if (value.startsWith('.')) return file.extension === value.slice(1);
                if (value.includes('/')) return file.mime_type === value;
                return file.extension === value || file.type === value;
            });
        },
        [accept],
    );

    const openFolder = useCallback((id: number | null) => {
        setFolderId(id);
        setSearch('');
        setTypeFilter(null);
    }, []);

    const createFolder = useCallback(
        async (name: string) => {
            try {
                await fileManagerApi.createFolder(name, folderId);
                toast.success('Folder created.');
                await refresh();
            } catch (error) {
                toast.error((error as Error).message);
            }
        },
        [folderId, refresh],
    );

    const renameFolder = useCallback(
        async (folder: MediaFolder, name: string) => {
            setFolders((prev) => prev.map((f) => (f.id === folder.id ? { ...f, name } : f)));
            try {
                await fileManagerApi.updateFolder(folder.id, { name });
                toast.success('Folder renamed.');
            } catch (error) {
                toast.error((error as Error).message);
            }
            await refresh();
        },
        [refresh],
    );

    const deleteFolder = useCallback(
        async (folder: MediaFolder) => {
            setFolders((prev) => prev.filter((f) => f.id !== folder.id));
            try {
                await fileManagerApi.deleteFolder(folder.id);
                toast.success('Folder deleted.');
            } catch (error) {
                toast.error((error as Error).message);
            }
            await refresh();
        },
        [refresh],
    );

    const renameFile = useCallback(
        async (file: MediaFile, name: string) => {
            setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, name } : f)));
            try {
                await fileManagerApi.renameFile(file.id, name);
                toast.success('File renamed.');
            } catch (error) {
                toast.error((error as Error).message);
                await refresh();
            }
        },
        [refresh],
    );

    const moveFile = useCallback(
        async (file: MediaFile, targetFolderId: number | null) => {
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
            try {
                await fileManagerApi.moveFile(file.id, targetFolderId);
                toast.success('File moved.');
            } catch (error) {
                toast.error((error as Error).message);
            }
            await refresh();
        },
        [refresh],
    );

    const deleteFile = useCallback(
        async (file: MediaFile) => {
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
            try {
                await fileManagerApi.deleteFile(file.id);
                toast.success('File deleted.');
            } catch (error) {
                toast.error((error as Error).message);
                await refresh();
            }
        },
        [refresh],
    );

    const replaceFile = useCallback((file: MediaFile) => {
        setFiles((prev) => prev.map((f) => (f.id === file.id ? file : f)));
    }, []);

    /** Called by the upload panel so new files appear without a full refetch. */
    const addUploadedFile = useCallback(
        (file: MediaFile) => {
            if (file.folder_id === folderId && !search && !typeFilter) {
                setFiles((prev) => [file, ...prev.filter((f) => f.id !== file.id)]);
            }
        },
        [folderId, search, typeFilter],
    );

    const toggleSort = useCallback(
        (key: SortKey) => {
            if (sort === key) {
                setDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
            } else {
                setSort(key);
                setDirection(key === 'name' || key === 'extension' ? 'asc' : 'desc');
            }
        },
        [sort],
    );

    return {
        // state
        folderId,
        breadcrumbs,
        folders,
        files,
        search,
        typeFilter,
        sort,
        direction,
        view,
        loading,
        // setters
        setSearch,
        setTypeFilter,
        setView,
        setSort,
        setDirection,
        toggleSort,
        // actions
        refresh,
        openFolder,
        createFolder,
        renameFolder,
        deleteFolder,
        renameFile,
        moveFile,
        deleteFile,
        replaceFile,
        addUploadedFile,
        isSelectable,
    };
}

export type FileManagerController = ReturnType<typeof useFileManager>;
