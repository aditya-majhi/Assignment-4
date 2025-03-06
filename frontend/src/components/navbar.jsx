import { CircleUserRound, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      path2: "/recruiter-dashboard",
    },
    {
      name: "Jobs",
      path: "/jobs",
      show: "candidate",
    },
    { name: "Post Job", path: "/add", show: "recruiter" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex-shrink-0 text-blue-800 font-bold"
            >
              JobbersHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-3">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) =>
                item?.show === role || item.name === "Dashboard" ? (
                  <Link
                    key={
                      role === "recruiter" && item.name === "Dashboard"
                        ? item.path2
                        : item.path
                    }
                    to={
                      role === "recruiter" && item.name === "Dashboard"
                        ? item.path2
                        : item.path
                    }
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : null
              )}
            </div>
            <div className="hidden md:block">
              <div className="flex items-center md:ml-6">
                <div className="relative">
                  <CircleUserRound
                    className="text-gray-800 cursor-pointer hover:text-blue-600"
                    onClick={toggleMenu}
                  />

                  {/* Dropdown menu */}
                  {isMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg p-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <Menu
              className="text-gray-800 cursor-pointer"
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="md:hidden absolute bg-white w-full shadow-md"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) =>
              item?.show === role || item.name === "Dashboard" ? (
                <Link
                  key={item.path}
                  to={
                    role === "recruiter" && item.name === "Dashboard"
                      ? item.path2
                      : item.path
                  }
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ) : null
            )}

            {/* Mobile Profile Actions */}
            <div className="pt-4 pb-3">
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base bg-gray-800 font-medium text-white hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
