'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormError } from '@/components/ui/form-error';
import { createBusiness, type FormState } from '../actions';

const initialState: FormState = { error: null };

export function NewBusinessForm() {
  const [state, formAction, pending] = useActionState(createBusiness, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Business name" name="name" required maxLength={80} autoFocus placeholder="Kerala Bakery" />
      <FormError message={state.error} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Creating…' : 'Create business'}
      </Button>
    </form>
  );
}