'use client';

import { Search } from 'lucide-react';
import { Label } from '../ui/label';
import { SidebarInput } from '../ui/sidebar';
import { useSearch } from '@/hooks/use-search';

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const { search, setSearch } = useSearch();

  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  );
}
