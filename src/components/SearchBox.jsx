import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { MIN_SEARCH_LENGTH } from '../lib/constants'
import { SearchIcon, XIcon } from './icons'

const SEARCH_DELAY = 400

function buildSearchPath(baseParams, term) {
  const params = new URLSearchParams(baseParams)
  if (term) {
    params.set('q', term)
  } else {
    params.delete('q')
  }
  params.delete('page')
  const query = params.toString()
  return { pathname: '/search', search: query ? `?${query}` : '' }
}

export default function SearchBox({ className = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const inputId = useId()
  const inputRef = useRef(null)

  const isSearchPage = location.pathname === '/search'
  const urlQuery = searchParams.get('q') ?? ''

  const [value, setValue] = useState(isSearchPage ? urlQuery : '')
  const debouncedValue = useDebounce(value, SEARCH_DELAY)
  const lastCommittedQuery = useRef(isSearchPage ? urlQuery : '')

  useEffect(() => {
    if (document.activeElement === inputRef.current) return
    const nextValue = isSearchPage ? urlQuery : ''
    setValue(nextValue)
    lastCommittedQuery.current = urlQuery
  }, [isSearchPage, urlQuery])

  const commitSearch = useCallback(
    (term) => {
      if (term === lastCommittedQuery.current) return
      lastCommittedQuery.current = term
      const baseParams = isSearchPage ? searchParams : undefined
      navigate(buildSearchPath(baseParams, term), { replace: isSearchPage })
    },
    [isSearchPage, navigate, searchParams],
  )

  useEffect(() => {
    const term = debouncedValue.trim()
    if (!isSearchPage && term.length < MIN_SEARCH_LENGTH) return
    commitSearch(term)
  }, [debouncedValue, isSearchPage, commitSearch])

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target
      const tagName = target instanceof HTMLElement ? target.tagName : ''
      if (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target?.isContentEditable
      ) {
        return
      }
      event.preventDefault()
      inputRef.current?.focus()
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    const term = value.trim()
    if (!isSearchPage && term.length < MIN_SEARCH_LENGTH) return
    commitSearch(term)
  }

  const clearSearch = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form role="search" onSubmit={submitSearch} className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search movies
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies"
        autoComplete="off"
        spellCheck="false"
        aria-keyshortcuts="/"
        className="w-full rounded-lg border border-line bg-elevated/80 py-2 pl-9 pr-9 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors [&::-webkit-search-cancel-button]:appearance-none focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      {value ? (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 py-0.5 font-sans text-[10px] text-zinc-600 sm:block"
        >
          /
        </kbd>
      )}
    </form>
  )
}
