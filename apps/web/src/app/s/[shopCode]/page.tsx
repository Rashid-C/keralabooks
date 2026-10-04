import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Overview' };

export default function OverviewPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Overview</h1>
      <p className="mt-2 text-sm text-muted">Today's sales and purchases will appear here.</p>
    </div>
  );
}