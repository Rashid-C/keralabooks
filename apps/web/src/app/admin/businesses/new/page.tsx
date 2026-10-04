import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { NewBusinessForm } from './new-business-form';

export const metadata: Metadata = { title: 'New business' };

export default async function NewBusinessPage() {
  await requireRole('super_admin');

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-semibold">New business</h1>
      <p className="mt-2 text-sm text-muted">You'll add its shops and owner next.</p>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-8">
        <NewBusinessForm />
      </div>
    </div>
  );
}