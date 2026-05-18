import { Icon } from '../ui/Icon';
import './Header.css';

export default function Header({ resultCount = 236, searchQuery, onSearchChange, viewMode, onViewModeChange, onMenuClick }) {
  return (
    <header className="page-header">
      {/* Mobile top bar */}
      <div className="page-header__mobile-top">
        <button className="page-header__menu-btn" onClick={onMenuClick} aria-label="Menu">
          <Icon name="menu" size={22} />
        </button>
        <span className="page-header__mobile-brand">MATERIAL LIBRARY</span>
        <div className="page-header__view-toggle">
          <button
            className={`page-header__view-btn${viewMode === 'grid' ? ' page-header__view-btn--active' : ''}`}
            onClick={() => onViewModeChange?.('grid')}
            title="Grid view"
          >
            <Icon name="grid_view" size={16} />
          </button>
          <button
            className={`page-header__view-btn${viewMode === 'list' ? ' page-header__view-btn--active' : ''}`}
            onClick={() => onViewModeChange?.('list')}
            title="List view"
          >
            <Icon name="view_list" size={16} />
          </button>
        </div>
      </div>

      {/* Desktop left */}
      <div className="page-header__left">
        <div className="page-header__name">
          <div className="page-header__title-row">
            <h1 className="page-header__title">Materials</h1>
          </div>
          <div className="page-header__results">
            <span className="page-header__count-num">{resultCount}</span>
            <span className="page-header__count-label">results</span>
          </div>
        </div>

        <div className="page-header__search">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="Search for material ref or number"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            className="page-header__search-input"
          />
        </div>
      </div>

      {/* Desktop right */}
      <div className="page-header__right">
        <div className="page-header__brand">
          <span className="page-header__brand-text">BESTSELLER</span>
        </div>
        <div className="page-header__view-toggle">
          <button
            className={`page-header__view-btn${viewMode === 'grid' ? ' page-header__view-btn--active' : ''}`}
            onClick={() => onViewModeChange?.('grid')}
            title="Grid view"
          >
            <Icon name="grid_view" size={16} />
          </button>
          <button
            className={`page-header__view-btn${viewMode === 'list' ? ' page-header__view-btn--active' : ''}`}
            onClick={() => onViewModeChange?.('list')}
            title="List view"
          >
            <Icon name="view_list" size={16} />
          </button>
        </div>
      </div>

      {/* Mobile title + search row */}
      <div className="page-header__mobile-body">
        <div className="page-header__mobile-title-row">
          <div>
            <h1 className="page-header__title">Materials</h1>
            <div className="page-header__results">
              <span className="page-header__count-num">{resultCount}</span>
              <span className="page-header__count-label"> results</span>
            </div>
          </div>
        </div>
        <div className="page-header__search">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="Search for material ref or number"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            className="page-header__search-input"
          />
        </div>
      </div>
    </header>
  );
}
