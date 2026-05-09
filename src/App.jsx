import { useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext.jsx';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import MaterialCard from './components/MaterialCard/MaterialCard';
import MattyAI from './components/MattyAI/MattyAI';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import { materials } from './data/materials';
import './App.css';

function MaterialLibraryApp() {
  const [activeNav, setActiveNav] = useState('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mattyOpen, setMattyOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery) return materials;
    const q = searchQuery.toLowerCase();
    return materials.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.composition?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q) ||
      m.brand?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
            <div className="app__content">
              <div className="welcome-banner">
                <div className="welcome-banner__text">
                  <h2>WELCOME TO MATERIAL LIBRARY</h2>
                  <p>Explore, manage and compare your fabric materials</p>
                </div>
                <div className="welcome-banner__visual" />
              </div>

              <div className={`materials-grid${viewMode === 'list' ? ' materials-grid--list' : ''}`}>
                {filtered.map(material => (
                  <MaterialCard key={material.id} material={material} />
                ))}
                {filtered.length === 0 && (
                  <div className="materials-empty">No materials match your search.</div>
                )}
              </div>
            </div>
          </div>

          <MattyAI
            isOpen={mattyOpen}
            onClose={() => setMattyOpen(false)}
          />
        </div>
      </div>

      {!mattyOpen && (
        <button
          className="matty-toggle"
          onClick={() => setMattyOpen(true)}
          title="Open Matty AI"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C6.686 2 4 4.686 4 8C4 10.21 5.164 12.148 6.916 13.254L6 18L10.5 15.9C10.666 15.966 10.832 16 11 16C14.314 16 17 13.314 17 10C17 6.686 13.866 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="7.5" cy="9" r="0.9" fill="currentColor"/>
            <circle cx="10" cy="9" r="0.9" fill="currentColor"/>
            <circle cx="12.5" cy="9" r="0.9" fill="currentColor"/>
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
