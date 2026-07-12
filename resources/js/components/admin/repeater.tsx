import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Row = Record<string, string>;

export function Repeater({
    label,
    rows,
    onChange,
    fields,
    addLabel = 'Add row',
}: {
    label: string;
    rows: Row[];
    onChange: (rows: Row[]) => void;
    fields: { key: string; placeholder: string }[];
    addLabel?: string;
}) {
    function update(index: number, key: string, value: string) {
        const next = rows.map((r, i) => (i === index ? { ...r, [key]: value } : r));
        onChange(next);
    }

    function add() {
        const blank: Row = {};
        fields.forEach((f) => (blank[f.key] = ''));
        onChange([...rows, blank]);
    }

    function remove(index: number) {
        onChange(rows.filter((_, i) => i !== index));
    }

    return (
        <div className="grid gap-3">
            <Label>{label}</Label>

            {rows.length === 0 && (
                <p className="text-sm text-muted-foreground">None yet.</p>
            )}

            <div className="grid gap-2">
                {rows.map((row, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <div className="grid flex-1 gap-2 sm:grid-cols-2">
                            {fields.map((field) => (
                                <Input
                                    key={field.key}
                                    value={row[field.key] ?? ''}
                                    placeholder={field.placeholder}
                                    onChange={(e) => update(index, field.key, e.target.value)}
                                />
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            aria-label="Remove"
                        >
                            <Trash2 className="size-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>

            <div>
                <Button type="button" variant="outline" size="sm" onClick={add}>
                    <Plus className="size-4" /> {addLabel}
                </Button>
            </div>
        </div>
    );
}
