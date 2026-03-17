import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">SafeLedger</Link>
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
                <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">Profile</Link>
                <button onClick={handleLogout} className="hover:bg-blue-700 px-3 py-2 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;