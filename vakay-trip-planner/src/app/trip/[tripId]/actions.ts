// src/app/trip/[tripId]/actions.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

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


export async function deleteLocation(locationId: number, tripId: string) {
  const supabase = createServerActionClient({ cookies });

  // The RLS policy we created ensures only valid users can perform this action.
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', locationId);

  if (error) {
    console.error('Delete Error:', error);
    // In a real app, you might want to return an error message to the user.
    return;
  }

  // Refresh the data on the trip page.
  revalidatePath(`/trip/${tripId}`);
}


// --- ADD THIS NEW FUNCTION ---
export async function inviteUser(prevState: any, formData: FormData) {
  const tripId = formData.get('trip_id') as string;
  const email = formData.get('email') as string;

  // Create a regular client to check the current user's permissions
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'Not authenticated.' };

  // Check if the current user is an admin of this trip
  const { data: participant } = await supabase
    .from('trip_participants')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single();

  if (participant?.role !== 'admin') {
    return { message: 'You do not have permission to invite users.' };
  }
  
  // Create a special admin client to invite users
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Invite the user by email
  const { data: invitedUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (inviteError) {
    return { message: `Error inviting user: ${inviteError.message}` };
  }

  // Add the invited user to the trip_participants table
  const { error: addError } = await supabase
    .from('trip_participants')
    .insert({
      trip_id: tripId,
      user_id: invitedUser.user.id,
      role: 'traveler', // Invited users are travelers by default
    });
  
  if (addError) {
    return { message: `Error adding user to trip: ${addError.message}` };
  }

  revalidatePath(`/trip/${tripId}`);
  return { message: `Invitation sent to ${email}!` };
}
