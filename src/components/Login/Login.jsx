import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { FaTimes, FaFacebook, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail, MdLock } from 'react-icons/md';
import { GiFoodTruck } from 'react-icons/gi';
import './Login.css';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isAdmin: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Added to access state

  const ADMIN_CREDENTIALS = {
    email: 'admin1@gmail.com',
    password: 'admin001',
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Fill in all fields.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let userData;

      if (formData.isAdmin) {
        if (
          formData.email === ADMIN_CREDENTIALS.email &&
          formData.password === ADMIN_CREDENTIALS.password
        ) {
          userData = {
            id: 'admin-001',
            name: 'Administrator',
            email: ADMIN_CREDENTIALS.email,
            phone: '+1234567890',
            address: '123 Admin Street',
            isAdmin: true,
          };
        } else {
          throw new Error('Incorrect email or password.');
        }
      } else {
        const response = await fetch('http://localhost:8081/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === 'User not found') {
            throw new Error('Not signed up. Please sign up..');
          } else if (data.error === 'Invalid password') {
            throw new Error('Email or password is incorrect.');
          } else {
            throw new Error(data.error || 'Login failed. Please check your information..');
          }
        }

        userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          address: data.user.address || '',
          isAdmin: data.user.isAdmin || false,
        };
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('isAdmin', JSON.stringify(userData.isAdmin));

      if (typeof setUser === 'function') {
        setUser(userData);
      }

      window.dispatchEvent(new Event('storage'));

      // Navigate to the page the user came from, or default to appropriate page
      const from = location.state?.from || (userData.isAdmin ? '/admin' : '/');
      navigate(from);
    } catch (err) {
      setError(err.message || 'An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <GiFoodTruck className="logo-icons" />
            <span className="brand-names">Delight Foods</span>
          </div>
          <button
            className="close-btn"
            onClick={() => navigate('/')}
            aria-label="Close login"
          >
            <FaTimes />
          </button>
        </div>

        <div className="welcome-section">
          <h1>{formData.isAdmin ? 'Admin Login' : 'Login'}</h1>
          <h3>Welcome Back!</h3>
          <p>{formData.isAdmin ? 'Please enter admin credentials' : 'Login to continue'}</p>
        </div>

        <div className="admin-toggle">
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <span>Login as Admin</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-groups">
            <label htmlFor="email">Email Address</label>
            <div className="input-field">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={formData.isAdmin ? 'Enter admin email' : 'Enter your email'}
                required
              />
              <div className="input-underline"></div>
            </div>
          </div>

          <div className="form-groups">
            <label htmlFor="password">Password</label>
            <div className="input-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={formData.isAdmin ? 'Enter admin password' : 'Enter your password'}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="input-underline"></div>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              formData.isAdmin ? 'Login as Admin' : 'Login'
            )}
          </button>

          {!formData.isAdmin && (
            <>
              {/* <div className="divider">
                <span>or</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn fb-btn">
                  <FaFacebook className="social-icon" />
                  Continue with Facebook
                </button>
                <button type="button" className="social-btn google-btn">
                  <FaGoogle className="social-icon" />
                  Continue with Google
                </button>
              </div> */}

              <div className="terms-agreement">
                By logging in, you agree to our <Link to="/terms">Terms</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </div>

              <div className="signup-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="food-decoration">
        <div className="food-item pizza"></div>
        <div className="food-item burger"></div>
        <div className="food-item sushi"></div>
      </div>
    </div>
  );
};

export default Login;