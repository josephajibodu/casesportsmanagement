export type MediaFileType = 'image' | 'video' | 'document' | 'other';

export type MediaFile = {
    id: number;
    folder_id: number | null;
    name: string;
    original_filename: string;
    mime_type: string | null;
    extension: string | null;
    type: MediaFileType;
    size: number;
    size_for_humans: string;
    width: number | null;
    height: number | null;
    path: string;
    url: string | null;
    uploaded_by?: string | null;
    created_at: string | null;
    created_at_for_humans: string | null;
    is_shared: boolean;
    share_url: string | null;
    shared_at: string | null;
    share_expires_at: string | null;
    share_has_password: boolean;
};

export type MediaFolder = {
    id: number;
    name: string;
    parent_id: number | null;
    files_count?: number;
    children_count?: number;
    created_at: string | null;
    children?: MediaFolder[];
};

export type SortKey = 'name' | 'created_at' | 'size' | 'extension';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

/** Sidebar filters. `null` means "All files" (browse by folder). */
export type TypeFilter = MediaFileType | 'recent' | null;

export type BrowseResponse = {
    folder: MediaFolder | null;
    breadcrumbs: MediaFolder[];
    folders: MediaFolder[];
    files: MediaFile[];
};

/** A file queued in the upload panel. */
export type UploadItem = {
    id: string;
    file: File;
    name: string;
    previewUrl: string | null;
    progress: number;
    status: 'queued' | 'uploading' | 'done' | 'error' | 'cancelled';
    error?: string;
    abort?: () => void;
};
