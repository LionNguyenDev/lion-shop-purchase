'use client';

import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/components/shop/use-debounced-value';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SearchInput({ placeholder, onSearch }: { placeholder: string; onSearch: (value: string) => void }) {
  const [value, setValue] = useState('');
  const debounced = useDebouncedValue(value);
  // Only react to the debounced value; onSearch is recreated on every parent render
  useEffect(() => onSearch(debounced.trim()), [debounced]);

  return (
    <div className='relative w-full sm:w-80'>
      <Search
        className='-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 text-muted-foreground'
        aria-hidden
      />
      <Input
        type='search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className='pl-11'
      />
    </div>
  );
}
