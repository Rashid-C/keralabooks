import { Constants, type Database } from '@keralabooks/db-types';

export type Unit = Database['public']['Enums']['product_unit'];

export const unitLabels: Record<Unit, string> = {
  pcs: 'Pieces',
  kg: 'Kilogram',
  g: 'Gram',
  litre: 'Litre',
  ml: 'Millilitre',
  dozen: 'Dozen',
  box: 'Box',
  packet: 'Packet',
  tray: 'Tray',
};

export const unitOptions = Constants.public.Enums.product_unit.map((u) => ({
  value: u,
  label: unitLabels[u],
}));