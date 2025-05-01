import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import Footer from '../components/Footer';
import { FaSearch, FaBookOpen, FaBookReader } from 'react-icons/fa';
import SplineBackground from '../components/SplineBackground';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

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
      <SplineBackground />

      <div className="content-container">
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

        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search books, authors, or topics..." 
              className="search-input"
              onClick={() => setShowPopup(true)} // Show popup when clicking on search bar
            />
            <button className="search-button">
              <FaSearch className="search-icon" />
              Search
            </button>
          </div>
        </section>

        {/* Popup Message */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Do You Like To Try A Book As Your Mood?</p>
              <div className="popup-buttons">
                <button onClick={() => setShowPopup(false)} className="skip-button">Skip</button>
                <button onClick={() => navigate('/moodbasebookreccomendation')} className="try-button">Let's Try</button>
              </div>
            </div>
          </div>
        )}

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
      
      <Footer />
    </div>
  );
};

export default Home;
