'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { changePassword, type ChangePasswordState } from './actions';

const initialState: ChangePasswordState = { error: null };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="New password"
        name="password"
        type="password"
        required
        minLength={12}
        maxLength={72}
        autoComplete="new-password"
        hint="At least 12 characters."
      />
      <Field label="Confirm new password" name="confirm" type="password" required autoComplete="new-password" />
      <FormError message={state.error} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Saving…' : 'Set password'}
      </Button>
    </form>
  );
}
