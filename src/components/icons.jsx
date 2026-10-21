function Svg({ children, className = 'size-5', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export function FilmIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </Svg>
  )
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Svg>
  )
}

export function XIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  )
}

export function HeartIcon({ filled = false, ...props }) {
  return (
    <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.6 4.9a5.4 5.4 0 0 0-7.7 0L12 5.8l-.9-.9a5.4 5.4 0 0 0-7.7 7.6l.9.9 7.7 7.6 7.7-7.6.9-.9a5.4 5.4 0 0 0 0-7.6Z" />
    </Svg>
  )
}

export function StarIcon(props) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <path d="m12 3.2 2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.9-5.3 2.9 1-6-4.4-4.3 6-.9L12 3.2Z" />
    </Svg>
  )
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="m15 18-6-6 6-6" />
    </Svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

export function ArrowUpRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Svg>
  )
}

export function PlayIcon(props) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5Z" />
    </Svg>
  )
}

export function AlertTriangleIcon(props) {
  return (
    <Svg {...props}>
      <path d="M10.3 4 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </Svg>
  )
}

export function RefreshIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </Svg>
  )
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
    </Svg>
  )
}
