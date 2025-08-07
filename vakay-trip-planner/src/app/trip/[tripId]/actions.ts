// src/app/trip/[tripId]/actions.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation'; // Make sure this import is present

// MODIFIED: The function signature has changed.
export async function saveItineraryDay(formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const schema = z.object({
    trip_id: z.string().uuid(),
    date: z.string().date(),
    notes: z.string().optional(),
    location_1_id: z.string().optional(),
  });

  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  // We can't return a message anymore, so we'll just log errors.
  if (!validatedFields.success) {
    console.error('Invalid data:', validatedFields.error.flatten().fieldErrors);
    return;
  }

  const locationId = validatedFields.data.location_1_id
    ? Number(validatedFields.data.location_1_id)
    : null;

  const { trip_id, date, notes } = validatedFields.data;

  const { error } = await supabase.from('itinerary_days').upsert(
    {
      trip_id,
      date,
      notes,
      location_1_id: locationId,
    },
    { onConflict: 'trip_id, date' }
  );

  if (error) {
    console.error('Upsert Error:', error);
    return;
  }

  // The revalidatePath call is still crucial.
  revalidatePath(`/trip/${trip_id}`);
  // We no longer return a state object.
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
