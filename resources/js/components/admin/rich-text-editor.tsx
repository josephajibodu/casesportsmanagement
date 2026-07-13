import Link from '@tiptap/extension-link';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

function ToolbarButton({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'inline-flex size-8 items-center justify-center rounded-md transition disabled:opacity-40',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <span className="mx-1 h-5 w-px bg-border" />;
}

function Toolbar({ editor }: { editor: Editor }) {
    function setLink() {
        const previous = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Link URL', previous ?? 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
            <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="size-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="size-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>
                <LinkIcon className="size-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="size-4" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="size-4" />
            </ToolbarButton>
        </div>
    );
}

export function RichTextEditor({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Link.configure({ openOnClick: false, autolink: true }),
        ],
        content: value || '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'tiptap min-h-[260px] px-4 py-3 focus:outline-none',
                'data-placeholder': placeholder ?? '',
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    if (!editor) {
        return <div className="min-h-[300px] rounded-md border bg-card" />;
    }

    return (
        <div className="overflow-hidden rounded-md border bg-card focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
