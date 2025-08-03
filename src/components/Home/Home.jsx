import React, { useState, useEffect } from 'react';
import { GiMeal, GiHotMeal, GiSushis } from 'react-icons/gi';
import { FaMotorcycle, FaLeaf, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];

  const popularItems = [
    {
      id: 1,
      name: 'Truffle Mushroom Pizza',
      description: 'Wild mushrooms, truffle oil, and three cheeses on our signature crust',
      price: 'Rs.1500.00',
      image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Gourmet Burger',
      description: 'Angus beef, aged cheddar, caramelized onions, and special sauce',
      price: 'Rs.170.00',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      name: 'Sushi Platter',
      description: 'Chef selection of 12 pieces nigiri and 1 specialty roll',
      price: 'Rs.180.00',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="home-container">
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        <div className="hero-slideshow">
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${image})` }}
            />
          ))}
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Delicious Meals Delivered to Your Door</h1>
          <p className="hero-subtitle">Order from your favorite local restaurants with just a few taps</p>
          <button className="order-now-btn" onClick={() => navigate('/menu')}>View Menu</button>
        </div>
        <div className="hero-image-animation">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947" 
            alt="Delicious food" 
            className="floating-image"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <FaMotorcycle />
          </div>
          <h3>Fast Delivery</h3>
          <p>Average delivery time under 30 minutes</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <GiHotMeal />
          </div>
          <h3>Fresh Meals</h3>
          <p>Prepared when you order</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FaLeaf />
          </div>
          <h3>Quality Ingredients</h3>
          <p>Sourced from trusted suppliers</p>
        </div>
      </section>

      {/* Popular Items */}
      <section className="popular-items">
        <h2>Our Popular Choices</h2>
        <p className="section-subtitle">Customer favorites this week</p>
        <div className="items-grid">
          {popularItems.map(item => (
            <div key={item.id} className="food-card">
              <div className="food-image">
                <img src={item.image} alt={item.name} className="zoom-image" />
                <div className="rating-badge">
                  <FaStar className="star-icon" />
                  <span>4.8</span>
                </div>
              </div>
              <div className="food-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="price-add">
                  {/* <span>{item.price}</span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Download Our App</h2>
          <p className="cta-subtitle">Get exclusive offers and faster ordering with our mobile app</p>
          <div className="app-buttons">
            <button className="app-btn app-store">App Store</button>
            <button className="app-btn google-play">Google Play</button>
          </div>
        </div>
        <div className="cta-image">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" 
            alt="Mobile app" 
            className="slide-in-image"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;