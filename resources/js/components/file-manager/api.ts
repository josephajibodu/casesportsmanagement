import type { BrowseResponse, MediaFile, MediaFolder, SortDirection, SortKey, TypeFilter } from './types';

const BASE = '/admin/file-manager';

/** Laravel accepts the encrypted XSRF-TOKEN cookie as an X-XSRF-TOKEN header. */
function csrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public errors: Record<string, string[]> = {},
    ) {
        super(message);
    }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrfToken(),
            ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new ApiError(
            payload.message ?? 'Something went wrong.',
            response.status,
            payload.errors ?? {},
        );
    }

    return response.status === 204 ? (undefined as T) : response.json();
}

export const fileManagerApi = {
    browse(params: {
        folderId: number | null;
        search: string;
        type: TypeFilter;
        sort: SortKey;
        direction: SortDirection;
        signal?: AbortSignal;
    }): Promise<BrowseResponse> {
        const query = new URLSearchParams();
        if (params.folderId !== null) query.set('folder_id', String(params.folderId));
        if (params.search) query.set('search', params.search);
        if (params.type) query.set('type', params.type);
        query.set('sort', params.sort);
        query.set('direction', params.direction);

        return request<BrowseResponse>(`${BASE}/browse?${query.toString()}`, { signal: params.signal });
    },

    tree(): Promise<{ tree: MediaFolder[] }> {
        return request(`${BASE}/tree`);
    },

    createFolder(name: string, parentId: number | null): Promise<{ folder: MediaFolder }> {
        return request(`${BASE}/folders`, {
            method: 'POST',
            body: JSON.stringify({ name, parent_id: parentId }),
        });
    },

    updateFolder(id: number, payload: { name?: string; parent_id?: number | null }): Promise<{ folder: MediaFolder }> {
        return request(`${BASE}/folders/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },

    deleteFolder(id: number): Promise<{ deleted: boolean }> {
        return request(`${BASE}/folders/${id}`, { method: 'DELETE' });
    },

    renameFile(id: number, name: string): Promise<{ file: MediaFile }> {
        return request(`${BASE}/files/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) });
    },

    moveFile(id: number, folderId: number | null): Promise<{ file: MediaFile }> {
        return request(`${BASE}/files/${id}/move`, {
            method: 'POST',
            body: JSON.stringify({ folder_id: folderId }),
        });
    },

    deleteFile(id: number): Promise<{ deleted: boolean }> {
        return request(`${BASE}/files/${id}`, { method: 'DELETE' });
    },

    share(id: number, payload: { expires_at?: string | null; password?: string | null; regenerate?: boolean } = {}): Promise<{ file: MediaFile }> {
        return request(`${BASE}/files/${id}/share`, { method: 'POST', body: JSON.stringify(payload) });
    },

    revokeShare(id: number): Promise<{ file: MediaFile }> {
        return request(`${BASE}/files/${id}/share`, { method: 'DELETE' });
    },

    downloadUrl(id: number): string {
        return `${BASE}/files/${id}/download`;
    },

    /**
     * Uploads a single file with progress + cancellation. Uses XHR because
     * fetch cannot report upload progress.
     */
    upload(
        file: File,
        folderId: number | null,
        handlers: {
            onProgress?: (percent: number) => void;
            onAbortReady?: (abort: () => void) => void;
        } = {},
    ): Promise<MediaFile> {
        return new Promise((resolve, reject) => {
            const body = new FormData();
            body.append('files[]', file, file.name);
            if (folderId !== null) body.append('folder_id', String(folderId));

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${BASE}/files`);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('X-XSRF-TOKEN', csrfToken());

            handlers.onAbortReady?.(() => xhr.abort());

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    handlers.onProgress?.(Math.round((event.loaded / event.total) * 100));
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const payload = JSON.parse(xhr.responseText);
                    resolve(payload.files[0]);
                } else {
                    let message = 'Upload failed.';
                    try {
                        const payload = JSON.parse(xhr.responseText);
                        message = payload.message ?? message;
                    } catch {
                        // keep default message
                    }
                    reject(new ApiError(message, xhr.status));
                }
            };

            xhr.onerror = () => reject(new ApiError('Upload failed.', xhr.status));
            xhr.onabort = () => reject(new ApiError('Upload cancelled.', 0));

            xhr.send(body);
        });
    },
};

export { ApiError };
