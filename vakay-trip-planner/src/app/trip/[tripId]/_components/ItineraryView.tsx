// src/app/trip/[tripId]/_components/ItineraryView.tsx
'use client';

import { getDatesInRange } from '@/lib/dateUtils';
import { Database } from '@/types/database.types';
import { DayCard } from './DayCard'; // Import our new component

type Trip = Database['public']['Tables']['trips']['Row'];
type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];

interface ItineraryViewProps {
  trip: Trip;
  itineraryDays: ItineraryDay[];
  locations: Location[];
}

export function ItineraryView({ trip, itineraryDays, locations }: ItineraryViewProps) {
  if (!trip.start_date || !trip.end_date) {
    return <p>Please set a start and end date for this trip.</p>;
  }

  const tripDates = getDatesInRange(new Date(trip.start_date), new Date(trip.end_date));
  const itineraryMap = new Map(itineraryDays.map((day) => [day.date, day]));
  const startDayOfWeek = tripDates[0].getUTCDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-md overflow-hidden">
        {weekdays.map((day) => (
          <div key={day} className="bg-white py-2 text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50 min-h-32"></div>
        ))}

        {tripDates.map((date) => {
          const dayData = itineraryMap.get(date.toISOString().split('T')[0]);
          return (
            <DayCard
              key={`${date.toISOString()}-${dayData?.location_1_id}-${dayData?.location_2_id}-${dayData?.notes}`}
              date={date}
              tripId={trip.id}
              dayData={dayData}
              locations={locations}
            />
          );
        })}
      </div>
    </div>
  );
}