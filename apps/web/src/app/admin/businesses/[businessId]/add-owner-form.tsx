'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { createOwner, type OwnerFormState } from './actions';

const initialState: OwnerFormState = { error: null, success: false };

export function AddOwnerForm({ businessId }: { businessId: string }) {
  const [state, formAction, pending] = useActionState(createOwner.bind(null, businessId), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Owner name" name="displayName" required maxLength={60} autoComplete="off" />
        <Field
          label="Username"
          name="username"
          required
          maxLength={30}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
        />
        <Field label="Email" name="email" type="email" required autoComplete="off" />
        <Field
          label="Temporary password"
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          hint="They'll be asked to choose their own at first login."
        />
      </div>

      <FormError message={state.error} />
      {state.success && (
        <p role="status" className="text-sm text-sale">
          Owner account created. Share the temporary password with them privately.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating account…' : 'Create owner account'}
      </Button>
    </form>
  );
}