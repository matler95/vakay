-- This script sets up all the security policies your app needs right now.

-- First, it's good practice to remove any old policies to ensure a clean slate.
DROP POLICY IF EXISTS "Allow authenticated users to create trips" ON public.trips;
DROP POLICY IF EXISTS "Allow users to view trips they are on" ON public.trips;
DROP POLICY IF EXISTS "Allow users to add themselves to a trip" ON public.trip_participants;
DROP POLICY IF EXISTS "Allow user to view their own participant entry" ON public.trip_participants;

------------------------------------------------------------------------------------

-- Now, let's create the correct policies from scratch.

-- POLICY 1: Allows any logged-in user to create a new trip.
CREATE POLICY "Allow authenticated users to create trips"
ON public.trips FOR INSERT TO authenticated WITH CHECK (true);

-- POLICY 2: Allows users to see a trip only if they are a participant.
CREATE POLICY "Allow users to view trips they are on"
ON public.trips FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM trip_participants
    WHERE trip_participants.trip_id = trips.id AND trip_participants.user_id = auth.uid()
  )
);

-- POLICY 3: Allows a user to add THEMSELVES to the participants list.
CREATE POLICY "Allow users to add themselves to a trip"
ON public.trip_participants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- POLICY 4: Allows a user to see their OWN entry in the participants list.
CREATE POLICY "Allow user to view their own participant entry"
ON public.trip_participants FOR SELECT TO authenticated USING (user_id = auth.uid());