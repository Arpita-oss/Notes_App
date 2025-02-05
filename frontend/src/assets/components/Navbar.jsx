import React, { useState } from 'react';
import { useAuth } from '../context/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Navbar */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-gray-100 
        transform transition-transform duration-300 
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col p-5 shadow-md z-40
      `}>
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                to="/favourite" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Favourites
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {user?.name || 'User'}
            </h3>
            <p className="text-sm text-gray-600">Software Engineer</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;