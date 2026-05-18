import { Icon } from '../ui/Icon';
import './FilterChip.css';

export default function FilterChip({ label, icon, active, onClick, variant }) {
  return (
    <button
      className={`filter-chip${active ? ' filter-chip--active' : ''}${variant ? ` filter-chip--${variant}` : ''}`}
      onClick={onClick}
    >
      {icon === 'star' && <Icon name="star" size={12} fill={active ? 1 : 0} />}
      <span className="filter-chip__label">{label}</span>
      <Icon name="expand_more" size={12} />
    </button>
  );
}
