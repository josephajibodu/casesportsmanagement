import { useMemo, useState } from 'react';

export function useRowSelection<T extends { id: number }>(rows: T[]) {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const ids = useMemo(() => rows.map((row) => row.id), [rows]);

    function toggle(id: number) {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    }

    function toggleAll() {
        setSelected((prev) =>
            prev.size === ids.length ? new Set() : new Set(ids),
        );
    }

    function clear() {
        setSelected(new Set());
    }

    const isAllSelected = ids.length > 0 && selected.size === ids.length;
    const isIndeterminate = selected.size > 0 && !isAllSelected;

    return {
        selected,
        toggle,
        toggleAll,
        clear,
        isAllSelected,
        isIndeterminate,
    };
}
