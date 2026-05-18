import { Icon } from '../ui/Icon';
import './Header.css';

function MattyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.8758 12.0088L11.1104 11.8324L10.2237 10.9203C9.23988 11.696 7.97575 12.1229 6.6681 12.1212C5.36058 12.1195 4.09841 11.6895 3.11713 10.9115L2.22708 11.8211L2.4611 11.9981C3.57185 12.8013 4.9374 13.2667 6.36046 13.3268L6.66679 13.3333C8.19914 13.3352 9.68301 12.8662 10.8758 12.0088Z" fill="currentColor"/>
      <path d="M4.65663 1.21212C4.65663 1.88156 4.05389 2.42424 3.31039 2.42424C3.27602 2.42424 3.24195 2.42308 3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411C2.47465 2.33695 1.96414 1.82821 1.96414 1.21212C1.96414 0.542685 2.56688 0 3.31039 0C4.05389 0 4.65663 0.542685 4.65663 1.21212Z" fill="currentColor"/>
      <path d="M11.3878 1.21212C11.3878 1.82821 10.8773 2.33695 10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208C10.11 2.42308 10.076 2.42424 10.0416 2.42424C9.29808 2.42424 8.69535 1.88156 8.69535 1.21212C8.69535 0.542685 9.29808 0 10.0416 0C10.7851 0 11.3878 0.542685 11.3878 1.21212Z" fill="currentColor"/>
      <path d="M6.67599 6.03575L3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411L0.00772882 8.04657L0.00148992 8.0578C0.0886747 8.6587 0.274614 9.23945 0.549007 9.78256L1.61661 7.85986L3.46092 4.53835L6.14273 7.33461L6.67599 7.89062L7.20795 7.33585L9.8904 4.53835L11.743 7.87401L12.8029 9.78241C13.0762 9.24147 13.2673 8.66419 13.3549 8.06569L10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208L6.67599 6.03575Z" fill="currentColor"/>
    </svg>
  );
}

export default function Header({ resultCount = 236, searchQuery, onSearchChange, viewMode, onViewModeChange, onMenuClick, mattyOpen, onMattyToggle }) {
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

        <button
          className={`page-header__matty-btn${mattyOpen ? ' page-header__matty-btn--active' : ''}`}
          onClick={onMattyToggle}
          title="Toggle Matty AI"
        >
          <MattyIcon />
        </button>

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
