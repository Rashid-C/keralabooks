import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary: 'border border-border bg-surface hover:bg-background',
} as const;

const sizes = {
  md: 'h-12 px-5 text-base',
  sm: 'h-9 px-4 text-sm',
} as const;

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
        'disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}