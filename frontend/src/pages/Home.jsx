import React, { useEffect } from 'react';
import Footer from '../components/Footer'; // Import the Footer component

import { FaSearch, FaBookOpen, FaBookReader } from 'react-icons/fa';
import SplineBackground from '../components/SplineBackground'; // Import the Spline background

import './Home.css';

const Home = () => {
  // Temporary data - replace with real data from your backend
  const featuredBooks = [
    { id: 1, title: 'Digital Literacy 101', author: 'John Smith', genre: 'Education', cover: '/images/book1.jpg' },
    { id: 2, title: 'The React Guide', author: 'Sarah Johnson', genre: 'Technology', cover: '/images/book2.jpg' },
    { id: 3, title: 'Modern Web Design', author: 'Mike Chen', genre: 'Design', cover: '/images/book3.jpg' },
  ];

  const genres = [
    'Fiction', 'Non-Fiction', 'Technology', 'Science', 
    'Business', 'History', 'Biography', 'Self-Help'
  ];

  useEffect(() => {
    console.log("✅ Home component is rendering!");
  }, []);

  return (
    <div className="home">
      {/* Spline 3D Background */}
      <SplineBackground />

      {/* Scrollable Content Container */}
      <div className="content-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Digital Library</h1>
            <p>Explore our collection of over 50,000 digital resources</p>
            <div className="stats">
              <div className="stat-item">
                <FaBookOpen className="stat-icon" />
                <span>50k+ eBooks</span>
              </div>
              <div className="stat-item">
                <FaBookReader className="stat-icon" />
                <span>24/7 Access</span>
              </div>
            </div>

          </div>
        </section>

        {/* Rest of the components */}
        <section className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search books, authors, or topics..." 
              className="search-input"
            />
            <button className="search-button">
              <FaSearch className="search-icon" />
              Search
            </button>
          </div>
        </section>

        {/* Featured Books */}
        <section className="featured-books">
          <h2 className="section-title">Featured Collection</h2>
          <div className="books-grid">
            {featuredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <img src={book.cover} alt={book.title} className="book-cover" />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-meta">
                    <span className="genre-tag">{book.genre}</span>
                    <button className="view-button">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Genres Section */}
        <section className="genres-section">
          <h2 className="section-title">Explore by Category</h2>
          <div className="genres-grid">
            {genres.map((genre, index) => (
              <div key={index} className="genre-card">
                <h3>{genre}</h3>
                <p>500+ Titles</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Start Your Reading Journey Today</h2>
            <p>Create a free account to access our full collection</p>
            <div className="cta-buttons">
              <button className="cta-button secondary">Get Started</button>

              <button className="cta-button primary">Sign Up Free</button>
              <button className="cta-button secondary">Learn More</button>
            </div>
          </div>
        </section>
      </div>
      <Footer /> {/* Render the Footer component */}
    </div>
  );
};

export default Home;
