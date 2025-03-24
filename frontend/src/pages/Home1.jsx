import React, { useEffect, useState } from 'react';
import { FaSearch, FaCode, FaPalette, FaMobile, FaMapMarker, FaPhone, FaEnvelope } from 'react-icons/fa';
import SplineBackground from '../components/SplineBackground';
import './Home1.css';

const Home1 = () => {
  const [activeNav, setActiveNav] = useState('');
  
  const services = [
    { id: 1, title: 'Web Development', icon: <FaCode />, description: 'Custom web solutions for modern businesses' },
    { id: 2, title: 'UI/UX Design', icon: <FaPalette />, description: 'User-centered interface design' },
    { id: 3, title: 'Mobile Apps', icon: <FaMobile />, description: 'Cross-platform mobile applications' },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveNav(sectionId);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
  };

  useEffect(() => {
    console.log("✅ Home component is rendering!");
  }, []);

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="nav-container">
        <a href="/home" className="nav-logo">NOVELNest</a>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      <SplineBackground />

      <div className="content-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to NOVELNest</h1>
            <p>Innovative technology services for the modern era</p>
            <div className="stats">
              <div className="stat-item">
                <FaCode className="stat-icon" />
                <span>100+ Projects</span>
              </div>
              <div className="stat-item">
                <FaPalette className="stat-icon" />
                <span>15+ Years Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section" id="services">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div className="about-content">
            <h2 className="section-title">About Us</h2>
            <p className="about-text">
              We are a digital solutions provider dedicated to creating innovative 
              technology solutions for businesses worldwide. With over 15 years of 
              experience, our team of experts delivers cutting-edge web and mobile 
              applications that drive business growth.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section" id="contact">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-container">
            <div className="contact-info">
              <div className="info-item">
                <FaMapMarker className="info-icon" />
                <p>123 Tech Street, Digital City, DC 12345</p>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <p>contact@digitalsolutions.com</p>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <textarea name="message" placeholder="Message" rows="5" required></textarea>
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" id="cta">
          <div className="cta-content">
            <h2>Start Your Digital Journey</h2>
            <p>Get in touch to discuss your project requirements</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => scrollToSection('contact')}>
                Get Started
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home1;
