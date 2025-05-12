import React, { useEffect, useState } from 'react';
import { FaSearch, FaCode, FaPalette, FaMobile, FaMapMarker, FaPhone, FaEnvelope, FaBook, FaUsers, FaArrowRight, FaPaperPlane } from 'react-icons/fa';
import SplineBackground from '../components/SplineBackground';
import './Home1.css';
import { Link } from 'react-router-dom';
import libraryBackground from '../assets/img/library-background.jpeg';
import libraryAbout from '../assets/img/about.jpg';

const Home1 = () => {
  const [activeSection, setActiveSection] = useState('home');
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleScroll = () => {
    const sections = ['home', 'services', 'about', 'contact' ,'login'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { top, bottom } = element.getBoundingClientRect();
        if (top <= scrollPosition && bottom > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
  };

  return (
    <div className="h1-home-container">
      {/* Navigation */}
      <nav className="h1-nav-container">
        <div className="h1-nav-logo">
          <h1>NOVELNest</h1>
        </div>
        <div className="h1-nav-links">
          <button 
            className={`h1-nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            Home
          </button>
          <button 
            className={`h1-nav-link ${activeSection === 'services' ? 'active' : ''}`}
            onClick={() => scrollToSection('services')}
          >
            Services
          </button>
          <button 
            className={`h1-nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => scrollToSection('about')}
          >
            About Us
          </button>
          <button 
            className={`h1-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </button>

          <Link 
            to="/login" 
            className={`h1-nav-link ${activeSection === 'login' ? 'active' : ''}`}
          >
            Login
          </Link>
        </div>
      </nav>

      <SplineBackground />

      {/* Home Section */}
      <section id="home" className="h1-hero-section">
        <div className="h1-content-container">
          <div className="h1-hero-content">
            <h2>Welcome to Our Library</h2>
            <p>Discover a world of knowledge with our extensive collection of books. Browse, borrow, and learn with our easy-to-use library management system.</p>
            <div className="h1-button-group">
              <Link to="/h-Learnmore" className="h1-cta-button">
                Learn More <FaArrowRight />
              </Link>
              <Link to="/login" className="h1-cta-button h1-cta-button-secondary">
                Get Started <FaArrowRight />
              </Link>
            </div>
          </div>
          <div className="h1-image-container">
            <img src={libraryBackground} alt="Library Interior" className="h1-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="h1-services-section">
        <h2>Our Services</h2>
        <div className="h1-services-grid">
          <div className="h1-service-card">
            <FaBook className="h1-service-icon" />
            <h3>Book Management</h3>
            <p>Easily add, update, and manage your book collection with our intuitive interface.</p>
          </div>
          <div className="h1-service-card">
            <FaSearch className="h1-service-icon" />
            <h3>Advanced Search</h3>
            <p>Find books quickly with our powerful search and filter capabilities.</p>
          </div>
          <div className="h1-service-card">
            <FaUsers className="h1-service-icon" />
            <h3>User Management</h3>
            <p>Track user activities and manage library memberships efficiently.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="h1-about-section">
        <h2>About Us</h2>
        <div className="h1-about-content">
          <div className="h1-about-text">
            <p>Our library management system is designed to make book management simple and efficient. With features like easy book addition, quick updates, and powerful search capabilities, we help libraries of all sizes manage their collections effectively.</p>
            <p>Whether you're a small community library or a large academic institution, our system provides the tools you need to organize and maintain your book collection.</p>
          </div>
          <img src={libraryAbout} alt="Library Collection" className="h1-about-image" />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="h1-contact-section">
        <h2>Get in Touch</h2>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        <form className="h1-contact-form" onSubmit={handleSubmit}>
          <div className="h1-form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="h1-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="h1-form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" className="h1-submit-button">
            Send Message <FaPaperPlane />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home1;
