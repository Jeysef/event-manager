'use client';

import { Search } from 'lucide-react';
import { Label } from '../ui/label';
import { SidebarInput } from '../ui/sidebar';
import { useSearch } from '@/hooks/use-search';
import { useRouter, usePathname } from 'next/navigation';

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const pathname = usePathname();
  const { search, setSearch } = useSearch();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (pathname !== '/events') {
      router.push('/events');
    }
    setSearch(e.target.value);
  }

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
          onChange={handleChange}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  );
}
