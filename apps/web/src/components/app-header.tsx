import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-actions';

type AppHeaderProps = {
  homeHref: string;
  subtitle?: string;
};

export function AppHeader({ homeHref, subtitle }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <Link href={homeHref} className="flex items-baseline gap-2">
        <span className="font-display text-xl font-semibold">KeralaBooks</span>
        {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
      </Link>
      <form action={signOut}>
        <Button type="submit" variant="secondary" size="sm">
          Sign out
        </Button>
      </form>
    </header>
  );
}