import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-6xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-primary px-5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}