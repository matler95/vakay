// src/app/(app)/dashboard/_components/CreateTripForm.tsx
'use client';

import { createTrip } from '../actions';
import { useActionState } from 'react'; // Change this import
import { useFormStatus } from 'react-dom'; // Keep this one

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Trip'}
    </button>
  );
}

export function CreateTripForm() {
  // useFormState is a hook for progressively enhancing forms that use Server Actions.
  const [state, formAction] = useActionState(createTrip, { message: '' });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          Trip Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Summer in Italy"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium leading-6 text-gray-900">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium leading-6 text-gray-900">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <SubmitButton />

      {state.message && <p className="text-sm text-red-500">{state.message}</p>}
    </form>
  );
}