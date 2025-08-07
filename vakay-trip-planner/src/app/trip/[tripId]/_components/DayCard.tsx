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
  const locationsMap = new Map(locations.map((loc) => [loc.id, loc]));

  // --- MODIFIED: Look up both locations ---
  const location1 = dayData?.location_1_id
    ? locationsMap.get(dayData.location_1_id)
    : null;
  const location2 = dayData?.location_2_id
    ? locationsMap.get(dayData.location_2_id)
    : null;

  // --- NEW: Dynamic Style Logic ---
  const dayStyle: React.CSSProperties = {};
  if (location1 && location2) {
    // If we have two locations, apply a gradient background
    dayStyle.background = `linear-gradient(to bottom right, ${location1.color}, ${location2.color})`;
  } else {
    // Otherwise, apply the simple top border color
    dayStyle.borderTop = `4px solid ${location1?.color || 'transparent'}`;
  }
  const textColor = (location1 && location2) ? 'text-white' : 'text-gray-900';


  return (
    <div className="relative bg-white p-2 min-h-32" style={dayStyle}>
      <time dateTime={date.toISOString()} className={`font-bold ${textColor}`}>
        {date.getUTCDate()}
      </time>

      <form action={saveItineraryDay} className="mt-1 flex h-full flex-col">
        <input type="hidden" name="trip_id" value={tripId} />
        <input type="hidden" name="date" value={date.toISOString().split('T')[0]} />

        {/* Location 1 Dropdown */}
        <select
          name="location_1_id"
          defaultValue={dayData?.location_1_id?.toString() || ''}
          className="w-full rounded border-none p-1 text-xs focus:ring-0"
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        {/* --- NEW: Location 2 Dropdown --- */}
        <select
          name="location_2_id"
          defaultValue={dayData?.location_2_id?.toString() || ''}
          className="w-full rounded border-none p-1 text-xs focus:ring-0 mt-1"
        >
          <option value="">Transfer to...</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        <textarea
          name="notes"
          rows={1}
          className="w-full flex-grow resize-none rounded border-none p-1 text-xs focus:ring-0 mt-1"
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
