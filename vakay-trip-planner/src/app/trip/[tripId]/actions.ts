// src/app/trip/[tripId]/actions.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function saveItineraryDay(prevState: any, formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const schema = z.object({
    trip_id: z.string().uuid(),
    date: z.string().date(),
    notes: z.string().optional(),
  });

  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Invalid data.' };
  }

  const { trip_id, date, notes } = validatedFields.data;

  // "Upsert" will update the row if one exists for that trip_id and date,
  // or it will insert a new one if it doesn't.
  const { error } = await supabase.from('itinerary_days').upsert(
    {
      trip_id,
      date,
      notes,
    },
    { onConflict: 'trip_id, date' } // Specify which columns to check for a conflict
  );

  if (error) {
    console.error('Upsert Error:', error);
    return { message: `Failed to save day: ${error.message}` };
  }

  // Revalidate the trip path to show the updated data immediately
  revalidatePath(`/trip/${trip_id}`);
  return { message: 'Saved!' }; // We can show a success message if we want
}