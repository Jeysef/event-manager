import { Event } from '@/lib/db';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Spinner } from '../ui/spinner';

export function EventDetailView({ event, onEdit, onDelete, isDeleting }: { event: Event, onEdit: () => void, onDelete: () => void, isDeleting?: boolean }) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{event.name}</CardTitle>
        <CardDescription>Event #{event.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="mt-1">{event.description || "No description provided"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">From</h3>
            <p className="mt-1">{format(event.from, "PPP p")}</p>
          </div>
          <div>
            <h3 className="font-medium">To</h3>
            <p className="mt-1">{format(event.to, "PPP p")}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={onEdit}>Edit Event</Button>
        <Button variant="outline" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? <Spinner className="mr-2" /> : null}
          {isDeleting ? 'Deleting...' : 'Delete Event'}
        </Button>
      </CardFooter>
    </>
  );
}
