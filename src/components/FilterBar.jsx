import { useId } from 'react'
import { DEFAULT_SORT, SORT_OPTIONS, YEARS } from '../lib/constants'
import { SELECT_CLASSES } from '../lib/ui'
import { ChevronDownIcon, XIcon } from './icons'

function SelectField({ label, value, onChange, disabled = false, children }) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className="flex min-w-0 flex-1 basis-36 flex-col gap-1.5 sm:max-w-56"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <span className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={`${SELECT_CLASSES} w-full disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </span>
    </label>
  )
}

export default function FilterBar({
  genres = [],
  filters,
  onChange,
  showGenre = true,
  className = '',
}) {
  const isFiltered =
    Boolean(filters.genre) || Boolean(filters.year) || filters.sort !== DEFAULT_SORT

  const resetFilters = () => {
    onChange({ ...filters, genre: '', year: '', sort: DEFAULT_SORT })
  }

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      {showGenre ? (
        <SelectField
          label="Genre"
          value={filters.genre}
          onChange={(genre) => onChange({ ...filters, genre })}
          disabled={genres.length === 0}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </SelectField>
      ) : null}

      <SelectField
        label="Year"
        value={filters.year}
        onChange={(year) => onChange({ ...filters, year })}
      >
        <option value="">Any year</option>
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Sort by"
        value={filters.sort}
        onChange={(sort) => onChange({ ...filters, sort })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>

      {isFiltered ? (
        <button
          type="button"
          onClick={resetFilters}
          className="flex h-[38px] items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors hover:bg-elevated hover:text-white"
        >
          <XIcon className="size-3.5" />
          Reset
        </button>
      ) : null}
    </div>
  )
}
