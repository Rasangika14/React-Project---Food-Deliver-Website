import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { GiFoodTruck } from 'react-icons/gi';
import './Navbar.css';

const Navbar = ({ setUser }) => {
  const navigate = useNavigate();
  const [user, setLocalUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Function to check user data in storage
    const checkUser = () => {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setLocalUser(parsedUser);
        if (typeof setUser === 'function') {
          setUser(parsedUser); // Update parent state only if setUser is a function
        }
      } else {
        setLocalUser(null);
        if (typeof setUser === 'function') {
          setUser(null);
        }
      }
    };

    // Initial check
    checkUser();

    // Listen for storage events
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
    setLocalUser(null);
    if (typeof setUser === 'function') {
      setUser(null);
    }
    setShowDropdown(false);
    navigate('/');
    window.dispatchEvent(new Event('storage')); // Trigger storage event
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search input after navigating
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Logo and brand name */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <GiFoodTruck className="logo-icons" />
            <span className="brand-naame">Delight Foods</span>
          </Link>
        </div>

        {/* Middle - Navigation links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/menu" className="nav-links">Menu</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">Contact Us</Link>
          </li>
          {user?.isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-links">My Dashboard</Link>
            </li>
          )}
        </ul>

        {/* Right side - Search, Cart, and Auth buttons */}
        <div className="navbar-right">
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search food or category..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch className="search-icon" />
              </button>
            </form>
          </div>

          {/* Uncomment if cart functionality is needed */}
          {/* <div className="cart-icon">
            <Link to="/cart" className="cart-link">
              <FaShoppingCart />
              <span className="cart-count">0</span>
            </Link>
          </div> */}

          {user ? (
            <div className="user-profile">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaUserCircle className="profile-icon" />
                <span className="profile-name">{user.name.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </Link>
                  {!user.isAdmin && (
                    <Link
                      to="/my-orders"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login">
                <Link to="/login">Login</Link>
              </button>
              <button className="btn-signup">
                <Link to="/signup">Sign Up</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;