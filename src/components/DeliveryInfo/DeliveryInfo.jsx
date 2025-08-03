import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './DeliveryInfo.css';

const DeliveryPage = ({ cart, total, onBack, user: propUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(propUser);

  const navigate = useNavigate();

  // Retrieve user from storage on mount
  useEffect(() => {
    if (!propUser) {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      }
    }
  }, [propUser]);

  // Auto-generate ZIP code on component mount
  useEffect(() => {
    const generateZipCode = () => {
      const randomZip = Math.floor(10000 + Math.random() * 90000).toString();
      setFormData(prev => ({
        ...prev,
        zipCode: randomZip
      }));
    };
    generateZipCode();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, street, city, state, zipCode, phone } = formData;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipCode || !phone) {
      setError('All fields are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      setError('Please enter a valid ZIP code.');
      return false;
    }
    if (!/^\d{10}$/.test(phone.replace(/[-()\s]/g, ''))) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('handleSubmit triggered', { user });

    if (!validateForm()) {
      console.log('Form validation failed', formData);
      embody;
    }
    console.log('Form validation passed', formData);

    const orderData = {
      user_id: user?.id || null,
      delivery_info: formData,
      cart,
      subtotal: total,
      delivery_fee: 450,
      total: total + 450
    };
    console.log('Order data prepared', orderData);

    try {
      console.log('Sending order to backend...');
      const response = await fetch('http://localhost:8081/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      console.log('Fetch response status:', response.status);

      const result = await response.json();
      console.log('Fetch response data:', result);

      if (response.ok && result.orderId) {
        console.log('Order saved, navigating to payment page');
        navigate('/payment', { 
          state: { 
            orderId: result.orderId,
            cart,
            total,
            deliveryInfo: formData // Pass deliveryInfo to Payment component
          } 
        });
      } else {
        console.error('Order submission failed:', result.error || 'Unknown error');
        setError(result.error || 'Error saving order');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      setError('Error saving order: ' + error.message);
    }
  };

  return (
    <div className="delivery-page">
      <div className="delivery-header">
        <button onClick={onBack} className="back-button">
          <FaArrowLeft /> Back
        </button>
        <h2>Delivery Information</h2>
      </div>

      <div className="delivery-content">
        <form onSubmit={handleSubmit} className="delivery-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-image-container">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="order-item-image" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://picsum.photos/150';
                    }}
                  />
                </div>
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.quantity} × Rs.{item.price.toFixed(2)}</p>
                  <p className="item-total">Rs.{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery:</span>
              <span>Rs.450.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>Rs.{(total + 450).toFixed(2)}</span>
            </div>
          </div>
          <button
            className="proceed-button"
            onClick={handleSubmit}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;