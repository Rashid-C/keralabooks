'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { createParty, type PartyFormState } from './actions';

const initialState: PartyFormState = { error: null };

export function AddPartyForm({ shopId }: { shopId: string }) {
  const [state, formAction, pending] = useActionState(createParty.bind(null, shopId), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Party name" name="name" required maxLength={80} placeholder="Hotel Rahmath" autoComplete="off" />
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          inputMode="tel"
          maxLength={20}
          placeholder="98765 43210"
          autoComplete="off"
        />
      </div>
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Adding…' : 'Add party'}
      </Button>
    </form>
  );
}