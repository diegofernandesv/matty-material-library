import { useState } from 'react';
import { Icon } from '../ui/Icon';
import './FilterBar.css';

const CHIPS = [
  { id: 'state',         label: 'State' },
  { id: 'groups',        label: 'Groups' },
  { id: 'categories',    label: 'Categories' },
  { id: 'subcategories', label: 'Subcategories' },
  { id: 'tags',          label: 'Tags' },
  { id: 'pulled',        label: 'Pulled materials' },
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
        <Icon name="add" size={16} />
        <span>Filter</span>
      </button>

      <div className="filter-bar__preset">
        <Icon name="star" size={16} />
        <span>Preset</span>
        <Icon name="expand_more" size={12} />
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
            <Icon name="expand_more" size={12} />
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
          <Icon name="close" size={16} />
          Clear all
        </button>
      </div>
    </div>
  );
}
