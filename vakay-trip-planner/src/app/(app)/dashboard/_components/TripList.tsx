// src/app/(app)/dashboard/_components/TripList.tsx
import Link from 'next/link';
import { Database } from '@/types/database.types';

// Define the type for a single trip based on our database schema
type Trip = Database['public']['Tables']['trips']['Row'];

interface TripListProps {
  trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        You haven't created any trips yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <Link
          href={`/trip/${trip.id}`} // This link will work in our next step
          key={trip.id}
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h4 className="font-bold text-lg text-gray-800">{trip.name}</h4>
          {trip.start_date && trip.end_date && (
            <p className="text-sm text-gray-600">
              {new Date(trip.start_date).toLocaleDateString()} -{' '}
              {new Date(trip.end_date).toLocaleDateString()}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}