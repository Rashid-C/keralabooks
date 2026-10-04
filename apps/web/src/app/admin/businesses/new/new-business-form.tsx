'use client';

import { useActionState } from 'react';
import { createBusiness, type FormState } from '../actions';

const initialState: FormState = { error: null };

export function NewBusinessForm() {
  const [state, formAction, pending] = useActionState(createBusiness, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Business name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          autoFocus
          placeholder="Kerala Bakery"
          className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create business'}
      </button>
    </form>
  );
}