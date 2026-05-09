import './FilterChip.css';

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilterChip({ label, icon, active, onClick, variant }) {
  return (
    <button
      className={`filter-chip${active ? ' filter-chip--active' : ''}${variant ? ` filter-chip--${variant}` : ''}`}
      onClick={onClick}
    >
      {icon === 'star' && <StarIcon filled={active} />}
      <span className="filter-chip__label">{label}</span>
      <ChevronDown />
    </button>
  );
}
