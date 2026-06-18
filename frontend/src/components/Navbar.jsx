import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider">
              <BookOpen className="h-6 w-6" />
              <span>BookVerse</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-book"
                  className="flex items-center space-x-1 bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-400 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Book</span>
                </Link>
                <div className="flex items-center space-x-2 pl-4 border-l border-indigo-500">
                  <UserIcon className="h-4 w-4 text-indigo-200" />
                  <span className="text-sm font-medium text-indigo-100">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full text-indigo-200 hover:text-white hover:bg-indigo-700 transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
