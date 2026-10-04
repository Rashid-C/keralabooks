export type Paise = number & { readonly __brand: 'Paise' };

export function toPaise(input: string): Paise {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input.trim());
  if (!match) throw new Error(`Invalid amount: ${input}`);

  const [, whole, fraction = ''] = match;
  return (Number(whole) * 100 + Number(fraction.padEnd(2, '0'))) as Paise;
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function formatINR(amount: Paise): string {
  return inrFormatter.format(amount / 100);
}

export function lineTotal(qty: number, rate: Paise): Paise {
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error(`Invalid quantity: ${qty}`);
  }
  return Math.round(qty * rate) as Paise;
}