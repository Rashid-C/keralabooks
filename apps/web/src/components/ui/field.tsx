import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type FieldProps = ComponentProps<'input'> & {
  label: string;
  name: string;
  hint?: string;
};

export function Field({ label, name, hint, id, className, ...props }: FieldProps) {
  const inputId = id ?? name;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-describedby={hintId}
        className={cn(
          'h-12 w-full rounded-xl border border-border bg-surface px-4 text-base outline-none transition',
          'focus:border-primary focus:ring-4 focus:ring-primary/15',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}