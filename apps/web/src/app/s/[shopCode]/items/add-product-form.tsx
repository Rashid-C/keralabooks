'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { SelectField } from '@/components/ui/select-field';
import { unitOptions } from '@/lib/units';
import { createProduct, type ProductFormState } from './actions';

const initialState: ProductFormState = { error: null };

export function AddProductForm({ shopId }: { shopId: string }) {
  const [state, formAction, pending] = useActionState(createProduct.bind(null, shopId), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Item name" name="name" required maxLength={80} placeholder="Rusk" autoComplete="off" />
        <SelectField label="Unit" name="unit" options={unitOptions} defaultValue="pcs" />
        <Field
          label="Price (₹)"
          name="rate"
          required
          inputMode="decimal"
          placeholder="45.50"
          autoComplete="off"
        />
      </div>
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Adding…' : 'Add item'}
      </Button>
    </form>
  );
}