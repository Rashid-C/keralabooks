'use client';

import { formatINR, lineTotal, type Paise, sumPaise, toPaise } from '@keralabooks/domain/money';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { type Unit, unitLabels } from '@/lib/units';
import { createEntry, type EntryFormState } from './actions';

type Product = { id: string; name: string; unit: Unit; rate_paise: number };
type Party = { id: string; name: string };
type Line = { key: string; productId: string; name: string; unit: Unit; qty: string; rate: string };

const QTY = /^\d+(\.\d{1,3})?$/;
const RATE = /^\d+(\.\d{1,2})?$/;
const initialState: EntryFormState = { error: null, savedAt: null };

function totalOf(line: Line): Paise | null {
  if (!QTY.test(line.qty) || !RATE.test(line.rate) || Number(line.qty) <= 0) return null;
  return lineTotal(Number(line.qty), toPaise(line.rate));
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-surface px-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15';

export function BillForm(props: {
  shopId: string;
  type: 'sale' | 'purchase';
  parties: Party[];
  products: Product[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState(createEntry.bind(null, props.shopId), initialState);
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    if (state.savedAt) setLines([]);
  }, [state.savedAt]);

  function addLine(productId: string) {
    const p = props.products.find((x) => x.id === productId);
    if (!p) return;
    setLines((ls) => [
      ...ls,
      { key: crypto.randomUUID(), productId: p.id, name: p.name, unit: p.unit, qty: '1', rate: (p.rate_paise / 100).toFixed(2) },
    ]);
  }

  function updateLine(key: string, patch: Partial<Line>) {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  const total = sumPaise(lines.map(totalOf).filter((t): t is Paise => t !== null));
  const linesJson = JSON.stringify(
    lines.map((l) => ({ productId: l.productId, name: l.name, unit: l.unit, qty: l.qty, rate: l.rate })),
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="type" value={props.type} />
      <input type="hidden" name="lines" value={linesJson} />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="partyId" className="text-sm font-medium">Party</label>
          <select id="partyId" name="partyId" required defaultValue="" className={`${inputClass} h-12 rounded-xl`}>
            <option value="" disabled>Choose a party</option>
            {props.parties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <Field label="Date" name="entryDate" type="date" required defaultValue={props.defaultDate} />
        <Field label="Bill no. (optional)" name="billNo" maxLength={30} autoComplete="off" />
      </div>

      <div className="rounded-xl border border-border">
        {lines.length > 0 && (
          <div className="divide-y divide-border">
            {lines.map((l) => {
              const t = totalOf(l);
              return (
                <div key={l.key} className="grid grid-cols-[1fr_6rem_7rem_7rem_2.5rem] items-center gap-3 px-4 py-3">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-muted">{unitLabels[l.unit]}</p>
                  </div>
                  <input aria-label={`Quantity of ${l.name}`} inputMode="decimal" value={l.qty}
                    onChange={(e) => updateLine(l.key, { qty: e.target.value })} className={inputClass} />
                  <input aria-label={`Rate of ${l.name}`} inputMode="decimal" value={l.rate}
                    onChange={(e) => updateLine(l.key, { rate: e.target.value })} className={inputClass} />
                  <p className="text-right font-medium tabular-nums">{t === null ? '—' : formatINR(t)}</p>
                  <button type="button" aria-label={`Remove ${l.name}`}
                    onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}
                    className="grid size-10 place-items-center rounded-lg text-muted transition hover:bg-background hover:text-danger">
                    <TrashIcon size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-border p-4 first:border-t-0">
          <PlusIcon size={18} className="text-muted" />
          <select aria-label="Add an item" value="" onChange={(e) => addLine(e.target.value)} className={inputClass}>
            <option value="" disabled>Add an item…</option>
            {props.products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} · {formatINR(p.rate_paise as Paise)}</option>
            ))}
          </select>
        </div>
      </div>

      {lines.length === 0 && (
        <Field label="Amount (₹) — when not adding items" name="amount" inputMode="decimal" placeholder="500" autoComplete="off" />
      )}

      <FormError message={state.error} />
      {state.savedAt && !pending && <p role="status" className="text-sm text-sale">Bill saved.</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <div>
          <p className="text-sm text-muted">{lines.length} {lines.length === 1 ? 'item' : 'items'}</p>
          <p className="font-display text-3xl font-semibold tabular-nums">{formatINR(total)}</p>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : `Save ${props.type === 'sale' ? 'sale' : 'purchase'}`}
        </Button>
      </div>
    </form>
  );
}