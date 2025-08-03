import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Delight Food deliver</h1>
          <p>Delivering happiness since 2023</p>
        </div>
      </section>

      <section className="our-story">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Delight Food deliver was founded in 2023 with a simple mission: to connect people with their favorite local 
            restaurants through fast, reliable delivery. What started as a small team of food enthusiasts has 
            grown into a platform serving thousands of happy customers daily.
          </p>
          <p>
            We partner with the best restaurants in your area to bring you a diverse selection of cuisines, 
            all available at the tap of a button.
          </p>
        </div>
        <div className="story-image">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            alt="Our restaurant partners" 
          />
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-card">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
              alt="Team member" 
            />
            <h3>Alex Johnson</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-card">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
              alt="Team member" 
            />
            <h3>Sarah Williams</h3>
            <p>Head of Operations</p>
          </div>
          <div className="team-card">
            <img 
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
              alt="Team member" 
            />
            <h3>Michael Chen</h3>
            <p>Technology Director</p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <i className="fas fa-heart"></i>
            <h3>Customer First</h3>
            <p>Your satisfaction is our top priority</p>
          </div>
          <div className="value-card">
            <i className="fas fa-bolt"></i>
            <h3>Fast Delivery</h3>
            <p>Food delivered fresh and fast</p>
          </div>
          <div className="value-card">
            <i className="fas fa-leaf"></i>
            <h3>Sustainability</h3>
            <p>Eco-friendly packaging and practices</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;