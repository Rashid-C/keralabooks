'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { createStaff, type StaffFormState } from './actions';

const initialState: StaffFormState = { error: null, success: false };

export function AddStaffForm({ shopId, shopCode }: { shopId: string; shopCode: string }) {
  const [state, formAction, pending] = useActionState(createStaff.bind(null, shopId), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="displayName" required maxLength={60} autoComplete="off" />
        <Field
          label="Username"
          name="username"
          required
          maxLength={30}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          hint={`They'll sign in with shop code ${shopCode} and this username.`}
        />
        <Field
          label="Temporary password"
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={72}
          autoComplete="new-password"
          hint="They'll choose their own at first login."
        />
      </div>

      <FormError message={state.error} />
      {state.success && (
        <p role="status" className="text-sm text-sale">
          Staff account created. Share the shop code, username, and temporary password privately.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating account…' : 'Add staff'}
      </Button>
    </form>
  );
}
