// src/app/trip/[tripId]/_components/DayCard.tsx
'use client';

import { Database } from '@/types/database.types';
// --- NEW: Import useState for the transfer switch ---
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveItineraryDay } from '../actions';
import { useRouter } from 'next/navigation';

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

// --- NEW: Helper function to determine text color based on background ---
// This improves accessibility by ensuring text is always readable.
function getTextColorForBackground(hexColor: string): 'text-white' | 'text-gray-900' {
  if (!hexColor) return 'text-gray-900';
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-gray-900' : 'text-white';
}


export function DayCard({ date, tripId, dayData, locations }: DayCardProps) {
  // --- NEW: State to control visibility of the second location dropdown ---
  const [isTransferDay, setIsTransferDay] = useState(!!dayData?.location_2_id);

  const router = useRouter();
  const [state, formAction] = useActionState(saveItineraryDay, { message: '' });

  useEffect(() => {
    if (state.message === 'Saved!') {
      router.refresh();
    }
  }, [state]);

  const locationsMap = new Map(locations.map((loc) => [loc.id, loc]));

  // --- MODIFIED: Look up both locations ---
  const location1 = dayData?.location_1_id ? locationsMap.get(dayData.location_1_id) : null;
  const location2 = dayData?.location_2_id ? locationsMap.get(dayData.location_2_id) : null;

  // --- REFINED: New style logic for consistent color backgrounds ---
  const dayStyle: React.CSSProperties = {};
  let textColor: string = 'text-gray-900';

  if (location1 && location2 && isTransferDay) {
    dayStyle.background = `linear-gradient(to bottom right, ${location1.color}, ${location2.color})`;
    textColor = 'text-white'; // Gradients are usually dark enough for white text
  } else if (location1) {
    dayStyle.background = location1.color;
    textColor = getTextColorForBackground(location1.color);
  }


  return (
    <div className="relative bg-white p-2 min-h-36" style={dayStyle}>
      <time dateTime={date.toISOString()} className={`font-bold ${textColor}`}>
        {date.getUTCDate()}
      </time>

      <form action={formAction} className="mt-1 flex h-full flex-col">
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

        {/* --- NEW: Conditionally render the second dropdown --- */}
        {isTransferDay && (
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
        )}

        <textarea
          name="notes"
          rows={1}
          className="w-full flex-grow resize-none rounded border-none p-1 text-xs focus:ring-0 mt-1"
          placeholder="Notes..."
          defaultValue={dayData?.notes || ''}
        />

        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {/* --- NEW: The transfer day toggle button --- */}
          <button
            type="button"
            onClick={() => setIsTransferDay(!isTransferDay)}
            className={`text-xs ${textColor} opacity-70 hover:opacity-100`}
          >
            {isTransferDay ? 'Cancel Transfer' : '+ Add Transfer'}
          </button>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
