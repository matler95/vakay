// src/app/trip/[tripId]/_components/ItineraryView.tsx
'use client';

import { getDatesInRange } from '@/lib/dateUtils';
import { Database } from '@/types/database.types';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveItineraryDay } from '../actions';

type Trip = Database['public']['Tables']['trips']['Row'];
type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];

interface ItineraryViewProps {
  trip: Trip;
  itineraryDays: ItineraryDay[];
}

// Updated SaveButton to be smaller for the calendar cells
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

export function ItineraryView({ trip, itineraryDays }: ItineraryViewProps) {
  const [state, formAction] = useActionState(saveItineraryDay, { message: '' });

  if (!trip.start_date || !trip.end_date) {
    return <p>Please set a start and end date for this trip.</p>;
  }

  const tripDates = getDatesInRange(new Date(trip.start_date), new Date(trip.end_date));
  const itineraryMap = new Map(itineraryDays.map((day) => [day.date, day]));

  // --- NEW: Calendar Grid Logic ---
  // Get the day of the week for the first day of the trip (0=Sunday, 1=Monday, etc.)
  const startDayOfWeek = tripDates[0].getUTCDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mt-8">
      {/* Main calendar grid container */}
      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-md overflow-hidden">
        {/* Render weekday headers */}
        {weekdays.map((day) => (
          <div key={day} className="bg-white py-2 text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}

        {/* Render empty cells for padding before the start date */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50 min-h-32"></div>
        ))}

        {/* Render a cell for each day of the trip */}
        {tripDates.map((date) => {
          const dayData = itineraryMap.get(date.toISOString().split('T')[0]);
          return (
            <div key={date.toISOString()} className="relative bg-white p-2 min-h-32">
              <time dateTime={date.toISOString()} className="font-bold">
                {date.getUTCDate()}
              </time>

              <form action={formAction} className="mt-1 flex h-full flex-col">
                <input type="hidden" name="trip_id" value={trip.id} />
                <input type="hidden" name="date" value={date.toISOString().split('T')[0]} />

                <textarea
                  name="notes"
                  rows={3}
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
        })}
      </div>
      {state.message && (
        <p className="mt-4 rounded-md bg-green-100 p-2 text-center text-sm text-green-700">
          {state.message}
        </p>
      )}
    </div>
  );
}