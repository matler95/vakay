// src/app/trip/[tripId]/_components/LocationManager.tsx
'use client';

import { Database } from '@/types/database.types';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addLocation } from '../actions';

type Location = Database['public']['Tables']['locations']['Row'];

interface LocationManagerProps {
  tripId: string;
  locations: Location[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
    >
      {pending ? 'Adding...' : 'Add Location'}
    </button>
  );
}

export function LocationManager({ tripId, locations }: LocationManagerProps) {
  const [state, formAction] = useActionState(addLocation, { message: '' });

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold">Locations</h2>
      <p className="mt-1 text-sm text-gray-500">Define places for your trip and give them a color.</p>
      
      {/* Form to add a new location */}
      <form action={formAction} className="mt-4 flex items-end gap-4">
        <input type="hidden" name="trip_id" value={tripId} />
        <div className="flex-grow">
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">Location Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Paris"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-900">Color</label>
          {/* This input provides a native color picker */}
          <input
            type="color"
            id="color"
            name="color"
            defaultValue="#3B82F6" // A nice default blue
            className="mt-1 h-10 w-14 cursor-pointer rounded-md border-gray-300 bg-white"
          />
        </div>
        <SubmitButton />
      </form>
      {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}

      {/* List of existing locations */}
      <div className="mt-6 space-y-2">
        <h3 className="text-md font-semibold">Defined Locations:</h3>
        {locations.length > 0 ? (
          locations.map((loc) => (
            <div key={loc.id} className="flex items-center gap-3 rounded-md border p-2">
              <div
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: loc.color }}
              ></div>
              <span className="font-medium">{loc.name}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No locations defined yet.</p>
        )}
      </div>
    </div>
  );
}