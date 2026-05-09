import './Header.css';

function IconSearch() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconGrid() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconList() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export default function Header({ resultCount = 236, searchQuery, onSearchChange, viewMode, onViewModeChange }) {
  return (
    <header className="page-header">
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
          <IconSearch />
          <input
            type="text"
            placeholder="Search for material ref or number"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            className="page-header__search-input"
          />
        </div>
      </div>

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
            <IconGrid />
          </button>
          <button
            className={`page-header__view-btn${viewMode === 'list' ? ' page-header__view-btn--active' : ''}`}
            onClick={() => onViewModeChange?.('list')}
            title="List view"
          >
            <IconList />
          </button>
        </div>
      </div>
    </header>
  );
}
