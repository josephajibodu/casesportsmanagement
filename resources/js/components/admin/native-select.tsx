import * as React from 'react';

import { cn } from '@/lib/utils';

function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
    return (
        <select
            className={cn(
                'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

export { NativeSelect };
