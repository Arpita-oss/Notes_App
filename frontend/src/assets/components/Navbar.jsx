import React from 'react';
import { useAuth } from '../context/ContextProvider';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const {user} = useAuth();
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-100 flex flex-col p-5 shadow-md">
      <div className="flex justify-between items-center mb-8">
        <Link to="/login" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"> 
        Logout
        </Link>
        {/* <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
          Logout
        </button> */}
      </div>
      
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
          </li>
          <li className="mb-4">
            <a href="/favourite" className="text-gray-700 hover:text-blue-600 transition">Favourites</a>
          </li>
        </ul>
      </nav>
      
      <div className="flex items-center">
        {/* <img 
          src="/path-to-profile-image.jpg" 
          alt="User Profile" 
          className="w-16 h-16 rounded-full mr-4" 
        /> */}
        <div>
            
          <h3 className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</h3>
          <p className="text-sm text-gray-600">Software Engineer</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;