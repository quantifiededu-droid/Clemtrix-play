import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../lib/firebase';
import { User } from 'firebase/auth';
import { Button } from './ui/Button';
import { Music, LogOut, LayoutDashboard, Settings, User as UserIcon, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/onboarding');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Clemtrix <span className="text-indigo-400">Play</span>
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {!loading && (
              user ? (
                <div className="flex items-center space-x-6">
                  <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/10 shadow-inner">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <button onClick={() => navigate('/auth/login')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    Log in
                  </button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/auth/signup')} className="rounded-lg">
                    Get Started
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
