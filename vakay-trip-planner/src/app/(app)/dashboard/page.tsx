// src/app/(app)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/database.types';

import { CreateTripForm } from './_components/CreateTripForm';
import { TripList } from './_components/TripList';

export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/'); // Should already be handled by layout, but good practice
  }

  // Fetch trips where the current user is a participant
  const { data: tripsData, error } = await supabase
    .from('trip_participants')
    .select('trips(*)') // This is the magic! Fetches all columns from the related 'trips' table
    .eq('user_id', user.id);
  
  // The result is an array of objects, where each object has a 'trips' property.
  // We need to extract just the trip details.
  const trips = tripsData?.map(item => item.trips).filter(Boolean) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
        <p className="text-gray-500">View your existing trips or create a new one to get started.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          {/* We're replacing the placeholder with our new TripList component */}
          <TripList trips={trips as any} />
        </div>

        <div className="order-1 md:order-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Create a New Trip</h3>
          <CreateTripForm />
        </div>
      </div>
    </div>
  );
}