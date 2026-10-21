import { Link, NavLink } from 'react-router-dom'
import { useWatchlist } from '../hooks/useWatchlist'
import Container from './Container'
import SearchBox from './SearchBox'
import { FilmIcon } from './icons'

const NAV_ITEMS = [
  { to: '/', label: 'Discover', end: true },
  { to: '/genres', label: 'Genres' },
  { to: '/watchlist', label: 'Watchlist' },
]

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm ${
    isActive
      ? 'bg-white/10 text-white'
      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
  }`

export default function Header() {
  const { items } = useWatchlist()
  const count = items.length

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-xl">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3 lg:gap-x-6">
        <Link
          to="/"
          aria-label="Reelist home"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-canvas shadow-[0_0_24px_-8px] shadow-accent/80">
            <FilmIcon className="size-5" />
          </span>
          <span className="hidden font-display text-lg font-semibold tracking-tight text-white sm:inline">
            Reelist
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-1 lg:ml-0">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
              {item.to === '/watchlist' && count > 0 ? (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-canvas">
                  {count > 99 ? '99+' : count}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <SearchBox className="w-full lg:ml-auto lg:w-72 xl:w-80" />
      </Container>
    </header>
  )
}
