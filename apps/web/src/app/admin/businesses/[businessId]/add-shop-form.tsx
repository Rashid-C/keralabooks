'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { createShop, type ShopFormState } from './actions';

const initialState: ShopFormState = { error: null };

export function AddShopForm({ businessId }: { businessId: string }) {
  const [state, formAction, pending] = useActionState(createShop.bind(null, businessId), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Shop name" name="name" required maxLength={80} placeholder="Areekode" />
        <Field
          label="Shop code"
          name="shopCode"
          required
          maxLength={20}
          placeholder="kb-areekode"
          hint="Staff type this to log in. Lowercase letters, numbers, hyphens."
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Adding…' : 'Add shop'}
      </Button>
    </form>
  );
}