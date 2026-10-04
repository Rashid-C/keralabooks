'use client';

import { CaretUpDownIcon } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';

type ShopOption = { code: string; name: string };

export function ShopSwitcher({ shops, currentCode }: { shops: ShopOption[]; currentCode: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(code: string) {
    const rest = pathname.slice(`/s/${currentCode}`.length);
    const moduleSegment = rest.split('/')[1];
    router.push(moduleSegment ? `/s/${code}/${moduleSegment}` : `/s/${code}`);
  }

  return (
    <div className="relative">
      <select
        value={currentCode}
        onChange={(e) => switchTo(e.target.value)}
        aria-label="Switch shop"
        className="h-10 appearance-none rounded-lg border border-border bg-surface pl-3 pr-9 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      >
        {shops.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <CaretUpDownIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}