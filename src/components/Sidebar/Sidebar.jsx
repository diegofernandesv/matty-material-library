import { useAuth } from '../../lib/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';
import './Sidebar.css';

function ChevronDown({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconMaterials() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconTemplates() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5H16M4 10H16M4 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconCategories() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17C2 14.2 4.7 12 8 12C11.3 12 14 14.2 14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 10C15.7 10 17 11.3 17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function IconMatty() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C6.686 2 4 4.686 4 8C4 10.21 5.164 12.148 6.916 13.254L6 18L10.5 15.9C10.666 15.966 10.832 16 11 16C14.314 16 17 13.314 17 10C17 6.686 13.866 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7.5" cy="9" r="0.9" fill="currentColor"/><circle cx="10" cy="9" r="0.9" fill="currentColor"/><circle cx="12.5" cy="9" r="0.9" fill="currentColor"/></svg>;
}
function IconUserGuide() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4H16V16H4z" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8H13M7 11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconSupport() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 13V13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 7C10 7 12 7.5 12 9.5C12 11 10 11.5 10 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconMinify() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10H14M6 7H14M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const NAV_ITEMS = [
  { id: 'materials',       label: 'Materials',        Icon: IconMaterials },
  { id: 'templates',       label: 'Templates',        Icon: IconTemplates },
  { id: 'categories',      label: 'Categories',       Icon: IconCategories },
  { id: 'user-management', label: 'User management',  Icon: IconUsers, hasArrow: true },
  { id: 'matty-ai',        label: 'Matty AI',         Icon: IconMatty },
];

export default function Sidebar({ activeItem, onItemClick, isOpen }) {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__logo">
          <div className="sidebar__brand-logo">
            <IconMatty />
          </div>
          <div className="sidebar__selector">
            <span className="sidebar__lib-label">Material Library</span>
            <ChevronDown />
          </div>
        </div>
        <button className="sidebar__collapse-btn">
          <IconMinify />
        </button>
      </div>

      <nav className="sidebar__menu">
        {NAV_ITEMS.map(({ id, label, Icon, hasArrow }) => (
          <button
            key={id}
            className={`sidebar__item${id === (activeItem || 'materials') ? ' sidebar__item--active' : ''}`}
            onClick={() => onItemClick?.(id)}
          >
            <span className="sidebar__item-icon">
              <Icon />
            </span>
            <span className="sidebar__item-label">{label}</span>
            {hasArrow && <ChevronDown />}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__footer-item">
          <IconUserGuide />
          <span>User guide</span>
        </button>
        <button className="sidebar__footer-item">
          <IconSupport />
          <span>Support</span>
        </button>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar sidebar__user-initials">
            {initials}
          </div>
          <span className="sidebar__user-name">{user?.email || 'Loading...'}</span>
        </div>
        <button onClick={handleLogout} title="Log out" style={{background:'none',border:'none',cursor:'pointer',color:'inherit'}}>
          <ChevronRight />
        </button>
      </div>
    </aside>
  );
}
