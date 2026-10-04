'use client';

import type { CategoryOption } from '@/api/types';
import { fieldClasses } from '@/components/ui/input';
import { normalizeText } from '@/lib/text';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type InputHTMLAttributes, type KeyboardEvent, forwardRef, useId, useState } from 'react';

interface CategoryComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  options: CategoryOption[];
}

/** Text input that suggests existing categories but also accepts a brand-new name. */
export const CategoryCombobox = forwardRef<HTMLInputElement, CategoryComboboxProps>(
  ({ value, onChange, options, onBlur, className, ...props }, ref) => {
    const listId = useId();
    const [open, setOpen] = useState(false);
    // Show every option until the user starts typing, so a prefilled value doesn't hide the rest
    const [typed, setTyped] = useState(false);
    const [active, setActive] = useState(-1);

    const query = typed ? normalizeText(value) : '';
    const matches = query ? options.filter((option) => normalizeText(option.name).includes(query)) : options;
    const expanded = open && matches.length > 0;

    const pick = (option: CategoryOption) => {
      onChange(option.name);
      setOpen(false);
      setTyped(false);
      setActive(-1);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((index) => Math.min(Math.max(index + step, 0), matches.length - 1));
      } else if (event.key === 'Enter' && expanded && matches[active]) {
        event.preventDefault();
        pick(matches[active]);
      } else if (event.key === 'Escape' && expanded) {
        setOpen(false);
      }
    };

    return (
      <div className='relative'>
        <input
          ref={ref}
          role='combobox'
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete='list'
          aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete='off'
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setTyped(true);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={(event) => {
            event.target.select();
            setTyped(false);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onBlur={(event) => {
            setOpen(false);
            setActive(-1);
            onBlur?.(event);
          }}
          onKeyDown={onKeyDown}
          className={cn(fieldClasses, 'h-11 pr-10', className)}
          {...props}
        />
        <ChevronDown
          className='-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-muted-foreground'
          aria-hidden
        />
        {expanded && (
          <ul
            id={listId}
            role='listbox'
            className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg'
          >
            {matches.map((option, index) => (
              <li
                key={option.id}
                id={`${listId}-${index}`}
                role='option'
                aria-selected={index === active}
                // Keep focus on the input so its blur doesn't close the list before the click lands
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(option)}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center px-3.5 text-[15px]',
                  index === active && 'bg-muted',
                  option.name === value && 'font-semibold text-primary'
                )}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
CategoryCombobox.displayName = 'CategoryCombobox';
