import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl font-bold text-white">📝</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-heading font-bold text-neutral-900 group-hover:text-blue-600 transition-colors duration-200">
                NotesApp
              </h1>
              <p className="text-sm text-neutral-500 -mt-1">Amazing Notes</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  href="/notes"
                  className="group flex items-center space-x-2 text-neutral-700 hover:text-blue-600 font-medium text-lg transition-all duration-200"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:animate-pulse"></span>
                  <span>My Notes</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <div className="bg-neutral-100 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-neutral-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-neutral-800 font-medium">
                      {user?.email}
                    </span>
                  </div>

                  <Button
                    onClick={logout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="group flex items-center space-x-2 text-neutral-700 hover:text-blue-600 font-medium text-lg transition-all duration-200"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:animate-pulse"></span>
                  <span>Login</span>
                </Link>

                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-neutral-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/notes"
                    className="text-neutral-700 hover:text-blue-600 font-medium text-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    My Notes
                  </Link>
                  <div className="flex flex-col space-y-4">
                    <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-neutral-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-neutral-800 font-medium">
                        {user?.email}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-neutral-700 hover:text-blue-600 font-medium text-lg transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link href="/register" onClick={toggleMenu}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;