import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User, AlertCircle, Compass } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { login, user, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Clear global context errors on mount
    setError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!username || !password) {
      setLoginError('Please enter both username and password.');
      return;
    }

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      // Error is already handled/stored in state by context
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Decorative Traditional Element */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron via-saffron-light to-saffron"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-cream-border overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-cream/40 border-b border-cream-border">
          <div className="w-16 h-16 bg-saffron-soft rounded-full flex items-center justify-center mx-auto mb-4 border border-saffron/20">
            <Compass className="w-8 h-8 text-saffron" />
          </div>
          <h2 className="text-xl font-bold font-serif text-teak tracking-wide">
            Aham Brahmaasmi Foundation®
          </h2>
          <p className="text-[10px] text-saffron uppercase font-semibold tracking-wider mt-1">
            (A Unit of Dakshinamnaya Sri Sharada Peetham, Sringeri)
          </p>
          <p className="text-xs text-teak-muted mt-2 font-sans">
            Internal Vidwan Scheduling & Camp Allocation System
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {(loginError || error) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-800">{loginError || error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-teak-light uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-teak-muted">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Enter username (e.g. director)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-cream-border rounded-xl focus:outline-none focus:border-saffron focus:bg-white text-sm text-teak transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-teak-light uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-teak-muted">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-cream-border rounded-xl focus:outline-none focus:border-saffron focus:bg-white text-sm text-teak transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Enter Dashboard'
            )}
          </button>

          {/* Quick instructions for testing */}
          <div className="p-3 bg-cream/50 rounded-lg border border-cream-border/50 text-[11px] text-teak-muted leading-relaxed">
            <span className="font-semibold text-teak block mb-1">Administrative Portals:</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="font-medium text-saffron">Director login:</span>
                <span className="block">director / password123</span>
              </div>
              <div>
                <span className="font-medium text-saffron">Super Admin login:</span>
                <span className="block">admin / password123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
