import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { GiFoodTruck } from 'react-icons/gi';
import { FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user from localStorage or sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setError('No user data found. Please log in.');
      // Redirect to login after a short delay to show error
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  if (!user && error) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent rendering until user data is loaded
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="brand-logoo">
            <GiFoodTruck className="logo-icon" />
            <span className="brand-names">Delight Foods</span>
          </div>
          <button
            className="close-btn"
            onClick={() => navigate('/')}
            aria-label="Close profile"
          >
            <FaTimes />
          </button>
        </div>

        <div className="profile-content">
          <h1>My Profile</h1>
          <p>Welcome back, {user.name}!</p>

          <div className="profile-details">
            <div className="detail-item">
              <label>Name</label>
              <p>{user.name || 'Not provided'}</p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>{user.email || 'Not provided'}</p>
            </div>
            {/* <div className="detail-item">
              <label>Phone</label>
              <p>{user.phone || 'Not provided'}</p>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <p>{user.address || 'Not provided'}</p>
            </div> */}
          </div>

          {/* Added My Orders button */}
          <Link to="/my-orders" className="my-orders-btn">
            View My Orders
          </Link>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('user');
              sessionStorage.removeItem('user');
              localStorage.removeItem('isAdmin');
              sessionStorage.removeItem('isAdmin');
              navigate('/login');
              window.dispatchEvent(new Event('storage'));
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;