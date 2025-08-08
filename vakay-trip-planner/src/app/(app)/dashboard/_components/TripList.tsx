// src/app/(app)/dashboard/_components/TripList.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Database } from '@/types/database.types';
import { deleteTrip } from '../actions';
import { EditTripModal } from './EditTripModal'; // Import the new modal

// Define a new Trip type that includes the user_role
type TripWithRole = Database['public']['Tables']['trips']['Row'] & {
  user_role: string | null;
};

interface TripListProps {
  trips: TripWithRole[];
}

export function TripList({ trips }: TripListProps) {
  const router = useRouter();

  if (trips.length === 0) { /* ... (no changes here) ... */ }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip.id} className="group relative rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div
            onClick={() => router.push(`/trip/${trip.id}`)}
            className="cursor-pointer"
          >
            <h4 className="font-bold text-lg text-gray-800">{trip.name}</h4>
            {trip.start_date && trip.end_date && (
              <p className="text-sm text-gray-600">
                {new Date(trip.start_date).toLocaleDateString()} -{' '}
                {new Date(trip.end_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action buttons are only shown for admins */}
          {trip.user_role === 'admin' && (
            <div className="absolute top-4 right-4 flex items-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
              <EditTripModal trip={trip} userRole={trip.user_role} />
              
              <form
                action={deleteTrip.bind(null, trip.id)}
                onSubmit={(e) => {
                  if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
                    e.preventDefault();
                  }
                }}
              >
                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">
                  Delete
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}