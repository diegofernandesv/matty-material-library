import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext.jsx';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import MaterialCard from './components/MaterialCard/MaterialCard';
import MaterialListRow from './components/MaterialCard/MaterialListRow';
import MattyAI from './components/MattyAI/MattyAI';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import { useMaterials } from './hooks/useMaterials';
import './App.css';

function MaterialLibraryApp() {
  const [activeNav, setActiveNav] = useState('materials');
  const [viewMode, setViewMode] = useState('grid');
  const [mattyOpen, setMattyOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { materials: filtered, query: searchQuery, setQuery: setSearchQuery } = useMaterials();

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === 'matty-ai') setMattyOpen(true);
  };

  return (
    <div className="app">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeItem={activeNav}
        onItemClick={id => { handleNavClick(id); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
      />

      <div className="app__right">
        <Header
          resultCount={filtered.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <div className="app__mid">
          <div className="app__left-col">
            <FilterBar />
            <div className={`app__content${viewMode === 'list' ? ' app__content--list' : ''}`}>
              {viewMode !== 'list' && (
                <div className="welcome-banner">
                  <div className="welcome-banner__text">
                    <h2>WELCOME TO MATERIAL LIBRARY</h2>
                    <p>Discover, manage & share materials used across all BESTSELLER brands. A collaborative platform for Material Management, Buyers, Suppliers & Designers.</p>
                  </div>
                  <div className="welcome-banner__visual" />
                </div>
              )}

              {viewMode === 'list' ? (
                <div className="materials-table-wrap">
                  <div className="materials-table">
                    <div className="materials-table__header">
                      <div>Material</div>
                      <div>Library</div>
                      <div>Composition</div>
                      <div>Subcategories</div>
                      <div>Weight</div>
                      <div>Manufacture Details</div>
                    </div>
                    {filtered.map(material => (
                      <MaterialListRow key={material.id} material={material} />
                    ))}
                    {filtered.length === 0 && (
                      <div className="materials-empty">No materials match your search.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="materials-grid">
                  {filtered.map(material => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="materials-empty">No materials match your search.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <MattyAI
            isOpen={mattyOpen}
            onClose={() => setMattyOpen(false)}
            onExpand={() => setActiveNav('matty-ai')}
          />
        </div>
      </div>

      {!mattyOpen && (
        <button
          className="matty-toggle"
          onClick={() => setMattyOpen(true)}
          title="Open Matty AI"
        >
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.8758 12.0088L11.1104 11.8324L10.2237 10.9203C9.23988 11.696 7.97575 12.1229 6.6681 12.1212C5.36058 12.1195 4.09841 11.6895 3.11713 10.9115L2.22708 11.8211L2.4611 11.9981C3.57185 12.8013 4.9374 13.2667 6.36046 13.3268L6.66679 13.3333C8.19914 13.3352 9.68301 12.8662 10.8758 12.0088Z" fill="currentColor"/>
            <path d="M4.65663 1.21212C4.65663 1.88156 4.05389 2.42424 3.31039 2.42424C3.27602 2.42424 3.24195 2.42308 3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411C2.47465 2.33695 1.96414 1.82821 1.96414 1.21212C1.96414 0.542685 2.56688 0 3.31039 0C4.05389 0 4.65663 0.542685 4.65663 1.21212Z" fill="currentColor"/>
            <path d="M11.3878 1.21212C11.3878 1.82821 10.8773 2.33695 10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208C10.11 2.42308 10.076 2.42424 10.0416 2.42424C9.29808 2.42424 8.69535 1.88156 8.69535 1.21212C8.69535 0.542685 9.29808 0 10.0416 0C10.7851 0 11.3878 0.542685 11.3878 1.21212Z" fill="currentColor"/>
            <path d="M6.67599 6.03575L3.20822 2.4208C3.18382 2.41915 3.15959 2.41692 3.13557 2.41411L0.00772882 8.04657L0.00148992 8.0578C0.0886747 8.6587 0.274614 9.23945 0.549007 9.78256L1.61661 7.85986L3.46092 4.53835L6.14273 7.33461L6.67599 7.89062L7.20795 7.33585L9.8904 4.53835L11.743 7.87401L12.8029 9.78241C13.0762 9.24147 13.2673 8.66419 13.3549 8.06569L10.2164 2.41411C10.1924 2.41692 10.1682 2.41915 10.1438 2.4208L6.67599 6.03575Z" fill="currentColor"/>
          </svg>
          <span>Matty AI</span>
        </button>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="app-loading" />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={session ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MaterialLibraryApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
