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
          mattyOpen={mattyOpen}
          onMattyToggle={() => setMattyOpen(o => !o)}
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
