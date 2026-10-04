import type { Metadata } from 'next';
import { EntriesPage } from '../_entries/entries-page';

export const metadata: Metadata = { title: 'Sales' };

export default async function SalesPage({ params }: PageProps<'/s/[shopCode]/sales'>) {
  const { shopCode } = await params;
  return <EntriesPage shopCode={shopCode} type="sale" />;
}