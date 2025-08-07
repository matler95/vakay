// src/app/trip/[tripId]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database.types';
import { ItineraryView } from './_components/ItineraryView';
import { LocationManager } from './_components/LocationManager'; // Import the new component
import { ParticipantManager } from './_components/ParticipantManager'; // Import the new component

export const dynamic = 'force-dynamic';

interface TripPageProps {
  params: {
    tripId: string;
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = params;
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { notFound(); }

  // Security check ... (no changes here)
  const { count } = await supabase
    .from('trip_participants')
    .select('*', { count: 'exact', head: true })
    .eq('trip_id', tripId)
    .eq('user_id', user.id);
if (count === 0) { notFound(); }

  // Fetch trip data ... (no changes here)
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single();
  if (!trip) { notFound(); }

  // Fetch itinerary days ... (no changes here)
  const { data: itineraryDays } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('trip_id', tripId);

  // --- NEW: Fetch all locations for this trip ---
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('trip_id', tripId)
    .order('name');

  // --- NEW: Fetch all participants and their profile info for this trip ---
  const { data: participants } = await supabase
    .from('trip_participants')
    .select('role, profiles(id, full_name)') // Join with profiles table
    .eq('trip_id', tripId);

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
      <p className="text-lg text-gray-500 mt-1">
        Your itinerary for {trip.destination || 'your upcoming trip'}.
      </p>
      
      {/* --- NEW: Render the Participant Manager --- */}
      <ParticipantManager tripId={trip.id} participants={participants || []} />
      
      {/* --- MODIFIED: Pass the locations prop --- */}
      <ItineraryView
        trip={trip}
        itineraryDays={itineraryDays || []}
        locations={locations || []}
      />

      {/* --- NEW: Render the Location Manager --- */}
      <LocationManager tripId={trip.id} locations={locations || []} />
    </div>
  );
}
