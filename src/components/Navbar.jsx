import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, FileText, Plus, List, Settings } from 'lucide-react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  const isManageActive = location.pathname.startsWith('/articles');

  const dropdownItems = [
    {
      to: "/articles/create",
      icon: Plus,
      label: "Create Article",
      description: "Write a new article"
    },
    {
      to: "/articles",
      icon: List,
      label: "All Articles",
      description: "View all published articles"
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-pink-100 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent tracking-wider hover:from-pink-700 hover:to-rose-700 transition-all duration-200"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center text-2xl font-sans">
            <h2>Zuri Admin</h2>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
          >
            Home
          </NavLink>

          {/* Magazine Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isManageActive
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              <span>Magazine</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-pink-100 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-pink-50">
                  <h3 className="text-sm font-semibold text-gray-900">Magazine Management</h3>
                  <p className="text-xs text-gray-500">Create and manage your articles</p>
                </div>
                
                {dropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-pink-50 transition-colors duration-150 group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-150">
                        <Icon className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-pink-700">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-pink-600">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}