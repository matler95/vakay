// src/app/trip/[tripId]/_components/DayCard.tsx
'use client';

import { Database } from '@/types/database.types';
import { useFormStatus } from 'react-dom';
import { saveItineraryDay } from '../actions';

type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];

interface DayCardProps {
  date: Date;
  tripId: string;
  dayData: ItineraryDay | undefined;
  locations: Location[];
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
    >
      {pending ? '...' : 'Save'}
    </button>
  );
}

export function DayCard({ date, tripId, dayData, locations }: DayCardProps) {
  // We've removed useActionState and useEffect from this component.

  const locationsMap = new Map(locations.map((loc) => [loc.id, loc]));
  const selectedLocation = dayData?.location_1_id
    ? locationsMap.get(dayData.location_1_id)
    : null;
  const dayColor = selectedLocation?.color || 'transparent';

  return (
    <div
      className="relative bg-white p-2 min-h-32"
      style={{ borderTop: `4px solid ${dayColor}` }}
    >
      <time dateTime={date.toISOString()} className="font-bold">
        {date.getUTCDate()}
      </time>

      {/* MODIFIED: The form now calls the server action directly. */}
      <form action={saveItineraryDay} className="mt-1 flex h-full flex-col">
        <input type="hidden" name="trip_id" value={tripId} />
        <input type="hidden" name="date" value={date.toISOString().split('T')[0]} />

        <select
          name="location_1_id"
          defaultValue={dayData?.location_1_id?.toString() || ''}
          className="w-full border-none p-1 text-xs focus:ring-0"
        >
          <option value="">No location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <textarea
          name="notes"
          rows={2}
          className="w-full flex-grow resize-none border-none p-1 text-xs focus:ring-0"
          placeholder="Notes..."
          defaultValue={dayData?.notes || ''}
        />

        <div className="mt-1 flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}