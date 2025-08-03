import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiFoodTruck } from 'react-icons/gi';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (name === 'confirmPassword' && errors.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:8081/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        // Initialize empty orders for new user
        await fetch('http://localhost:8081/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
          },
          body: JSON.stringify({ orders: [] }),
        });

        alert('Account created successfully! Please login.');
        navigate('/login');
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-page bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="signup-container flex max-w-4xl w-full bg-white rounded-lg shadow-lg">
        {/* Left Side - Logo and Brand */}
        <div className="brand-section p-8 bg-gray-50 flex-1">
          <div className="brand-logo w-24 h-24 mx-auto">
                      <GiFoodTruck className="logo-icons" />
                      {/* <span className="brand-names">Delight Foods</span> */}
          </div>
          {/* <div className="logo-container mb-4">
            <img
              src="https://th.bing.com/th/id/R.8f964c0a6d42764a3f99da6ac23f3300?rik=1TIq7ME1XIMCMA&pid=ImgRaw&r=0"
              alt="Delight Food Logo"
              className="brand-logo w-24 h-24 mx-auto"
            />
          </div> */}
          <h1 className="brand-name text-2xl font-bold text-center">Delight Food</h1>
          <p className="brand-tagline text-center text-gray-600">Delicious meals delivered to your doorstep</p>

          <div className="benefits-list mt-6 space-y-4">
            <div className="benefit-item flex items-center">
              <i className="fas fa-bolt text-blue-500 mr-2"></i>
              <span>Fast delivery in 30 minutes</span>
            </div>
            <div className="benefit-item flex items-center">
              <i className="fas fa-tag text-blue-500 mr-2"></i>
              <span>Exclusive member discounts</span>
            </div>
            <div className="benefit-item flex items-center">
              <i className="fas fa-utensils text-blue-500 mr-2"></i>
              <span>Access to premium restaurants</span>
            </div>
          </div>
        </div>

        {/* Center - Sign Up Form */}
        <div className="form-section p-8 flex-1">
          <div className="form-header mb-6">
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of happy customers</p>
          </div>

          {apiError && <div className="api-error text-red-500 mb-4">{apiError}</div>}

          <form onSubmit={handleSubmit} className="signup-form space-y-4">
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message text-red-500 text-sm">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Create a password"
              />
              {errors.password && <span className="error-message text-red-500 text-sm">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message text-red-500 text-sm">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group checkbox-group flex items-left">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className={`mr-2 ${errors.agreedToTerms ? 'border-red-500' : ''}`}
              />
              <label htmlFor="agreedToTerms">
                I agree to the <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
              </label>
              {errors.agreedToTerms && <span className="error-message text-red-500 text-sm">{errors.agreedToTerms}</span>}
            </div>

            <button
              type="submit"
              className="signup-btn w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="login-link text-center">
              Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in here</Link>
            </div>

            <div className="social-login mt-4">
              {/* <p className="divider relative text-center">
                <span className="absolute left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500">or sign up with</span>
                <hr className="border-gray-300" />
              </p> */}
              <div className="social-buttons flex space-x-2 mt-4">
                {/* <button type="button" className="social-btn google w-full bg-red-600 text-white py-2 rounded flex items-center justify-center">
                  <i className="fab fa-google mr-2"></i> Google
                </button>
                <button type="button" className="social-btn facebook w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center">
                  <i className="fab fa-facebook-f mr-2"></i> Facebook
                </button> */}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Close Button */}
        <div className="close-section p-4">
          <Link to="/" className="close-btn text-gray-600 hover:text-gray-800">
            <i className="fas fa-times text-2xl"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;