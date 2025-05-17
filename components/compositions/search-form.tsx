'use client';

import { Search, X } from 'lucide-react';
import { Label } from '../ui/label';
import { useSearch } from '@/hooks/use-search';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { endOfDay, format, startOfDay } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { useMemo } from 'react';
import { ButtonGroup } from '../ui/button-group';
import { DateRange } from 'react-day-picker';
import { Input } from '../ui/input';

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const pathname = usePathname();
  const { search, setSearch, startDate, setStartDate, endDate, setEndDate } = useSearch();
  const range = useMemo(() => ({ from: startDate ?? undefined, to: endDate ?? undefined }), [startDate, endDate]);

  const redirectToEvents = () => {
    if (pathname !== '/events') {
        router.push('/events');
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setSearch(e.target.value);
  }
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
      if (range?.from) setStartDate(startOfDay(range.from));
      if (range?.to) setEndDate(endOfDay(range.to));
      if (!range) {
        setStartDate(null);
        setEndDate(null);
      }
  }

  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <div className="relative flex items-center">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Type to search..."
            className="h-8 pl-7 rounded-e-none"
            value={search}
            onFocus={redirectToEvents}
            onChange={handleChange}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </div>
        <Popover onOpenChange={open => open && redirectToEvents()}>
          <ButtonGroup>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 min-w-[120px] px-2 rounded-s-none border-s-0"
              >
                {startDate && endDate
                  ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
                  : startDate
                    ? format(startDate, 'MMM d, yyyy')
                    : 'Pick date(s)'}
              </Button>
            </PopoverTrigger>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8"
              onClick={() => {
                setSearch('');
                handleDateRangeChange(undefined);
              }}
            >
              <X className="" />
            </Button>
          </ButtonGroup>
          <PopoverContent align="end" className="w-auto p-4">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={handleDateRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
}
