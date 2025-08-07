// src/app/trip/[tripId]/actions.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation'; // Make sure this import is present

// --- FIX: Add the 'prevState' argument back to the function signature ---
export async function saveItineraryDay(prevState: any, formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const schema = z.object({
    trip_id: z.string().uuid(),
    date: z.string().date(),
    notes: z.string().optional(),
    location_1_id: z.string().optional(),
    location_2_id: z.string().optional(),
  });

  // This line will now work correctly
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error('Invalid data:', validatedFields.error.flatten().fieldErrors);
    // Return a state object on failure
    return { message: 'Invalid data submitted.' };
  }

  // --- HANDLE BOTH LOCATION IDs ---
  const location1Id = validatedFields.data.location_1_id
    ? Number(validatedFields.data.location_1_id)
    : null;
  const location2Id = validatedFields.data.location_2_id
    ? Number(validatedFields.data.location_2_id)
    : null;

  const { trip_id, date, notes } = validatedFields.data;

  const { error } = await supabase.from('itinerary_days').upsert(
    {
      trip_id,
      date,
      notes,
      location_1_id: location1Id,
      location_2_id: location2Id, // <-- ADD THIS
    },
    { onConflict: 'trip_id, date' }
  );

  if (error) {
    console.error('Upsert Error:', error);
    return { message: `Failed to save day: ${error.message}` };
  }

  revalidatePath(`/trip/${trip_id}`);
  // Return the success message for the useEffect hook
  return { message: 'Saved!' };
}



export async function addLocation(prevState: any, formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const schema = z.object({
    trip_id: z.string().uuid(),
    name: z.string().min(1, { message: 'Location name cannot be empty.' }),
    color: z.string(),
  });

  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Invalid data.' };
  }
  
  const { error } = await supabase.from('locations').insert(validatedFields.data);

  if (error) {
    return { message: `Failed to add location: ${error.message}` };
  }

  revalidatePath(`/trip/${validatedFields.data.trip_id}`);
  return { message: 'Location added!' };
}
