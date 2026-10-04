import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type SelectFieldProps = ComponentProps<'select'> & {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
};

export function SelectField({ label, name, options, id, className, ...props }: SelectFieldProps) {
  const selectId = id ?? name;

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        className={cn(
          'h-12 w-full rounded-xl border border-border bg-surface px-4 text-base outline-none transition',
          'focus:border-primary focus:ring-4 focus:ring-primary/15',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}