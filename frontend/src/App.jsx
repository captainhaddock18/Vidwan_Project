import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vidwans from './pages/Vidwans';
import Programs from './pages/Programs';
import Availability from './pages/Availability';

// Route protector for authenticated sessions
const ProtectedLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-serif font-bold text-teak">Aham Brahmasmi System</h2>
          <p className="text-xs text-teak-light">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes wrapped in layouts */}
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/vidwans"
        element={
          <ProtectedLayout>
            <Vidwans />
          </ProtectedLayout>
        }
      />
      <Route
        path="/programs"
        element={
          <ProtectedLayout>
            <Programs />
          </ProtectedLayout>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedLayout>
            <Availability />
          </ProtectedLayout>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
