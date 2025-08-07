// src/app/trip/[tripId]/_components/EditTripForm.tsx
'use client';

import { Database } from '@/types/database.types';
import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateTripDetails } from '../actions';

type Trip = Database['public']['Tables']['trips']['Row'];

interface EditTripFormProps {
  trip: Trip;
  userRole: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export function EditTripForm({ trip, userRole }: EditTripFormProps) {
  // Only admins can edit
  if (userRole !== 'admin') {
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction] = useActionState(updateTripDetails, { message: '' });

  if (!isEditing) {
    return (
      <button onClick={() => setIsEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-800">
        Edit Trip Details
      </button>
    );
  }

  return (
    <div className="my-6 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Edit Trip Details</h2>
      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="trip_id" value={trip.id} />
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Trip Name</label>
          <input type="text" id="name" name="name" required defaultValue={trip.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium">Destination</label>
          <input type="text" id="destination" name="destination" defaultValue={trip.destination || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium">Start Date</label>
            <input type="date" id="start_date" name="start_date" required defaultValue={trip.start_date || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium">End Date</label>
            <input type="date" id="end_date" name="end_date" required defaultValue={trip.end_date || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {state.message && <p className="text-sm text-gray-600">{state.message}</p>}
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-semibold text-gray-700">Cancel</button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}