import React, { useState } from 'react';
import { GiFoodTruck } from 'react-icons/gi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Thank you for your message, ${formData.name}! We'll contact you soon.`);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        alert(result.error || 'Error sending message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Error submitting message: ' + error.message);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="contact-container">
        {/* Left Side - Company Info */}
        <div className="company-info">
          {/* <div className="company-logo">
            <img 
              src="https://th.bing.com/th/id/R.8f964c0a6d42764a3f99da6ac23f3300?rik=1TIq7ME1XIMCMA&pid=ImgRaw&r=0" 
              alt="Delight Food deliver Logo" 
            />
            <h2>Delight Foods</h2>
          </div> */}
          <div className="brand-logoo">
                      <GiFoodTruck className="logo-icon" />
                      <span className="brand-names">Delight Foods</span>
                    </div>

          <div className="company-description">
            <p>
              Delivering delicious meals to your doorstep since 2023. 
              We partner with the best local restaurants to bring you 
              a diverse selection of cuisines.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Address</h4>
                <p>123, Negambo Rd, Kurunegala</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-phone-alt"></i>
              <div>
                <h4>Phone</h4>
                <p>037-9999880</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>delightfood@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="social-media">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <ul>
              <li>Monday - Friday: 9:00 AM - 10:00 PM</li>
              <li>Saturday: 10:00 AM - 11:00 PM</li>
              <li>Sunday: 10:00 AM - 9:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>

          {/* Additional Features */}
          <div className="additional-features">
            <div className="feature-card-a">
              <i className="fas fa-headset"></i>
              <h3>24/7 Customer Support</h3>
              <p>Our team is always ready to assist you with any questions or issues.</p>
            </div>

            <div className="feature-card-a">
              <i className="fas fa-map-marked-alt"></i>
              <h3>Track Your Order</h3>
              <p>Follow your delivery in real-time from restaurant to your door.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Map */}
      <div className="map-container">
        <iframe
          title="Our Location"
          src="https://www.google.com/maps/place/7%C2%B020'24.7%22N+80%C2%B000'59.8%22E/@7.340202,80.016597,17z/data=!3m1!4b1!4m4!3m3!8m2!3d7.340202!4d80.016597?entry=ttu&g_ep=EgoyMDI1MDQwMi4xIKXMDSoASAFQAw%3D%3D"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;