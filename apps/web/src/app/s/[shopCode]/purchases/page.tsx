import type { Metadata } from 'next';
import { EntriesPage } from '../_entries/entries-page';

export const metadata: Metadata = { title: 'Purchases' };

export default async function PurchasesPage({ params }: PageProps<'/s/[shopCode]/purchases'>) {
  const { shopCode } = await params;
  return <EntriesPage shopCode={shopCode} type="purchase" />;
}