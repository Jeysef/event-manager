import { parseAsIsoDateTime, useQueryState } from 'nuqs';

export const useSearch = () => {
  const [search, setSearch] = useQueryState('search', {throttleMs: 300, clearOnDefault: true, defaultValue: ''});
  const [startDate, setStartDate] = useQueryState('startDate', parseAsIsoDateTime.withOptions({ clearOnDefault: true }));
  const [endDate, setEndDate] = useQueryState('endDate', parseAsIsoDateTime.withOptions({ clearOnDefault: true }));

  return {
    search,
    startDate,
    endDate,
    setSearch,
    setStartDate,
    setEndDate,
  };
};
