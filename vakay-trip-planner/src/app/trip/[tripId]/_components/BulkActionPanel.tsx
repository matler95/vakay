// src/app/trip/[tripId]/_components/BulkActionPanel.tsx
'use client';

import { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bulkUpdateDays } from '../actions';

type Location = Database['public']['Tables']['locations']['Row'];

interface BulkActionPanelProps {
  tripId: string;
  selectedDates: Set<string>;
  locations: Location[];
}

export function BulkActionPanel({ tripId, selectedDates, locations }: BulkActionPanelProps) {
  // Don't render the panel if no dates are selected
  if (selectedDates.size === 0) {
    return null;
  }

  // Bind the server action with the necessary data that isn't in the form
  const actionWithData = bulkUpdateDays.bind(null, tripId, Array.from(selectedDates));

  return (
    <Card className="mb-4 bg-gray-50">
      <CardContent className="p-4">
        <form action={actionWithData} className="flex items-center gap-4">
          <p className="text-sm font-medium">
            {selectedDates.size} day(s) selected
          </p>
          <Select name="location_id">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Set location..." />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Apply</Button>
        </form>
      </CardContent>
    </Card>
  );
}