import { useState } from 'react';
import './FilterBar.css';

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconPlus() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconStar() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.8 6.2L14.5 6.6L11 9.7L12.1 14.4L8 11.9L3.9 14.4L5 9.7L1.5 6.6L6.2 6.2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
function IconClear() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const CHIPS = [
  { id: 'state',       label: 'State' },
  { id: 'groups',      label: 'Groups' },
  { id: 'categories',  label: 'Categories' },
  { id: 'subcategories', label: 'Subcategories' },
  { id: 'tags',        label: 'Tags' },
  { id: 'pulled',      label: 'Pulled materials' },
];

export default function FilterBar() {
  const [activeFilters, setActiveFilters] = useState(new Set());

  const toggleFilter = (id) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const hasActive = activeFilters.size > 0;

  return (
    <div className="filter-bar">
      <button className="filter-bar__add">
        <IconPlus />
        <span>Filter</span>
      </button>

      <div className="filter-bar__preset">
        <IconStar />
        <span>Preset</span>
        <ChevronDown />
      </div>

      <div className="filter-bar__divider" />

      <div className="filter-bar__chips">
        {CHIPS.map(chip => (
          <button
            key={chip.id}
            className={`filter-chip${activeFilters.has(chip.id) ? ' filter-chip--active' : ''}`}
            onClick={() => toggleFilter(chip.id)}
          >
            <span className="filter-chip__label">{chip.label}</span>
            <ChevronDown />
          </button>
        ))}
      </div>

      <div className="filter-bar__actions">
        <button className={`filter-bar__action${hasActive ? ' filter-bar__action--visible' : ''}`}>
          Save preset
        </button>
        <button
          className={`filter-bar__action filter-bar__action--clear${hasActive ? ' filter-bar__action--visible' : ''}`}
          onClick={() => setActiveFilters(new Set())}
        >
          <IconClear />
          Clear all
        </button>
      </div>
    </div>
  );
}
