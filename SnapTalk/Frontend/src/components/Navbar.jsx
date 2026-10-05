import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 w-full text-slate-100 flex justify-between items-center px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-cyan-500/10">
          S
        </div>
        <h3 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          SnapTalk
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors duration-200">
          Home
        </Link>
        {token ? (
          <>
            <Link to="/profile" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors duration-200">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500 hover:to-pink-500 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white rounded-lg transition-all duration-300 shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors duration-200">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition-all duration-300 shadow-md shadow-cyan-500/10"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
