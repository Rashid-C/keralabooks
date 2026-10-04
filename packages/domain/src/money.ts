export type Paise = number & { readonly __brand: 'Paise' };

export function toPaise(input: string): Paise {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(input.trim());
  if (!match) throw new Error(`Invalid amount: ${input}`);

  const [, whole, fraction = ''] = match;
  return (Number(whole) * 100 + Number(fraction.padEnd(2, '0'))) as Paise;
}