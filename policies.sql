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


-- Remove old policies if they exist, for a clean setup
DROP POLICY IF EXISTS "Allow participants to add locations to a trip" ON public.locations;
DROP POLICY IF EXISTS "Allow participants to view trip locations" ON public.locations;

------------------------------------------------------------------------------------

-- POLICY 1: Allow users to ADD a location to a trip IF they are a participant of that trip.
CREATE POLICY "Allow participants to add locations to a trip"
ON public.locations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.trip_participants
    WHERE trip_participants.trip_id = locations.trip_id AND trip_participants.user_id = auth.uid()
  )
);

-- POLICY 2: Allow users to SEE locations for a trip IF they are a participant of that trip.
CREATE POLICY "Allow participants to view trip locations"
ON public.locations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.trip_participants
    WHERE trip_participants.trip_id = locations.trip_id AND trip_participants.user_id = auth.uid()
  )
);


-- Remove old policies if they exist for a clean setup.
DROP POLICY IF EXISTS "Allow participants to view itinerary days" ON public.itinerary_days;
DROP POLICY IF EXISTS "Allow participants to create itinerary days" ON public.itinerary_days;
DROP POLICY IF EXISTS "Allow participants to update itinerary days" ON public.itinerary_days;

------------------------------------------------------------------------------------

-- POLICY 1: Allow users to SEE itinerary days for trips they are on.
CREATE POLICY "Allow participants to view itinerary days"
ON public.itinerary_days FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.trip_participants
    WHERE trip_participants.trip_id = itinerary_days.trip_id AND trip_participants.user_id = auth.uid()
  )
);

-- POLICY 2: Allow users to ADD itinerary days for trips they are on.
CREATE POLICY "Allow participants to create itinerary days"
ON public.itinerary_days FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip_participants
    WHERE trip_participants.trip_id = itinerary_days.trip_id AND trip_participants.user_id = auth.uid()
  )
);

-- POLICY 3: Allow users to UPDATE itinerary days for trips they are on.
-- (Required because our "upsert" function might perform an update).
CREATE POLICY "Allow participants to update itinerary days"
ON public.itinerary_days FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.trip_participants
    WHERE trip_participants.trip_id = itinerary_days.trip_id AND trip_participants.user_id = auth.uid()
  )
);