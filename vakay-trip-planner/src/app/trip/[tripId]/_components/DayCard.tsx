// src/app/trip/[tripId]/_components/DayCard.tsx
'use client';

import { Database } from '@/types/database.types';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveItineraryDay } from '../actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, PlusCircle } from 'lucide-react';

type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];
type Trip = Database['public']['Tables']['trips']['Row'];

interface DayCardProps {
  date: Date;
  tripId: string;
  dayData: ItineraryDay | undefined;
  locations: Location[];
}

function getTextColorForBackground(hexColor: string): 'text-white' | 'text-gray-900' {
    if (!hexColor) return 'text-gray-900';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-gray-900' : 'text-white';
}

export function DayCard({ date, tripId, dayData, locations }: DayCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState(saveItineraryDay, { message: '', status: '' });

  useEffect(() => {
    if (state.status === 'success') {
      setIsEditing(false);
      router.refresh();
    }
  }, [state, router]);

  const locationsMap = new Map(locations.map((loc) => [loc.id, loc]));
  const location1 = dayData?.location_1_id ? (locationsMap.get(dayData.location_1_id) ?? null) : null;
  const location2 = dayData?.location_2_id ? (locationsMap.get(dayData.location_2_id) ?? null) : null;
  const dayStyle: React.CSSProperties = {};
  let textColor: string = 'text-gray-900';
  if (location1 && location2) {
    dayStyle.background = `linear-gradient(to bottom right, ${location1.color}, ${location2.color})`;
    textColor = 'text-white';
  } else if (location1) {
    dayStyle.background = location1.color;
    textColor = getTextColorForBackground(location1.color);
  }

  if (isEditing) {
    return <EditView dayStyle={dayStyle} textColor={textColor} date={date} tripId={tripId} dayData={dayData} locations={locations} formAction={formAction} onCancel={() => setIsEditing(false)} state={state} />;
  }
  
  return <DisplayView dayStyle={dayStyle} textColor={textColor} date={date} dayData={dayData} onEdit={() => setIsEditing(true)} location1={location1} location2={location2} />;
}


// --- Ensure this interface is correct ---
interface DisplayViewProps {
    dayStyle: React.CSSProperties;
    textColor: string;
    date: Date;
    dayData: ItineraryDay | undefined;
    onEdit: () => void;
    location1: Location | null;
    location2: Location | null;
}

function DisplayView({ dayStyle, textColor, date, dayData, onEdit, location1, location2 }: DisplayViewProps) {
    return (
        <div className="relative flex flex-col p-2 min-h-36" style={dayStyle}>
            <time dateTime={date.toISOString()} className={`font-bold ${textColor}`}>
                {date.getUTCDate()}
            </time>
            <div className="flex-grow mt-1 text-xs">
                {location1 && <p className={`font-semibold ${textColor}`}>{location1.name}</p>}
                {location2 && <p className={`text-sm ${textColor}`}>→ {location2.name}</p>}
                <p className={`mt-1 whitespace-pre-wrap ${textColor} opacity-80`}>{dayData?.notes || ''}</p>
            </div>
            <div className="absolute top-1 right-1">
                <TooltipProvider><Tooltip><TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className={`h-6 w-6 ${textColor} hover:bg-white/20`} onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </TooltipTrigger><TooltipContent><p>Edit Day</p></TooltipContent></Tooltip></TooltipProvider>
            </div>
        </div>
    );
}

interface EditViewProps {
    dayStyle: React.CSSProperties;
    textColor: string;
    date: Date;
    tripId: string;
    dayData: ItineraryDay | undefined;
    locations: Location[];
    formAction: (payload: FormData) => void;
    onCancel: () => void;
    state: { message: string, status: string };
}

function EditView({ dayStyle, textColor, date, tripId, dayData, locations, formAction, onCancel, state }: EditViewProps) {
    const { pending } = useFormStatus();
    const [isTransfer, setIsTransfer] = useState(!!dayData?.location_2_id);

    return (
        <div className="relative flex flex-col p-2 min-h-36" style={dayStyle}>
            <time dateTime={date.toISOString()} className={`font-bold ${textColor}`}>
                {date.getUTCDate()}
            </time>
            <form action={formAction} className="mt-1 space-y-2">
                <input type="hidden" name="trip_id" value={tripId} />
                <input type="hidden" name="date" value={date.toISOString().split('T')[0]} />

                <Select name="location_1_id" defaultValue={dayData?.location_1_id?.toString() || ''}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Location" /></SelectTrigger>
                    <SelectContent>
                        {locations.map((loc) => <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {isTransfer && (
                    <Select name="location_2_id" defaultValue={dayData?.location_2_id?.toString() || ''}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Transfer to..." /></SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
                
                <Textarea name="notes" placeholder="Notes..." defaultValue={dayData?.notes || ''} className="text-xs resize-none" rows={2} />

                <div className="flex justify-between items-center">
                    <TooltipProvider><Tooltip><TooltipTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className={`h-6 w-6 ${textColor} hover:bg-white/20`} onClick={() => setIsTransfer(!isTransfer)}>
                            <PlusCircle className={`h-4 w-4 transition-transform ${isTransfer ? 'rotate-45' : ''}`} />
                        </Button>
                    </TooltipTrigger><TooltipContent><p>{isTransfer ? 'Remove Transfer' : 'Add Transfer'}</p></TooltipContent></Tooltip></TooltipProvider>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="sm" className={`h-7 ${textColor} hover:bg-white/20`} onClick={onCancel}>Cancel</Button>
                        <Button type="submit" size="sm" className="h-7" disabled={pending}>{pending ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
                {state.message && state.status === 'error' && <p className="text-xs text-red-200">{state.message}</p>}
            </form>
        </div>
    );
}