import React from "react";
import { FaBook, FaDownload, FaStar, FaHeart, FaShare } from "react-icons/fa";
import "./h-Learnmore.css";

const LearnMore = () => {
  return (
    <div className="hl-learnmore-container">
      <div className="hl-learnmore-header">
        <h2>Discover Your Next <span>Favorite Book</span></h2>
        <p>Explore our vast collection of books and find the perfect read for your mood</p>
      </div>

      <div className="hl-features">
        <div className="hl-feature-card">
          <div className="hl-feature-icon">
            <FaBook />
          </div>
          <h3>Read Online</h3>
          <p>Access thousands of books instantly through our online reader</p>
        </div>

        <div className="hl-feature-card">
          <div className="hl-feature-icon">
            <FaDownload />
          </div>
          <h3>Download Books</h3>
          <p>Download your favorite books to read offline anytime</p>
        </div>

        <div className="hl-feature-card">
          <div className="hl-feature-icon">
            <FaStar />
          </div>
          <h3>Rate & Review</h3>
          <p>Share your thoughts and help others discover great books</p>
        </div>

        <div className="hl-feature-card">
          <div className="hl-feature-icon">
            <FaHeart />
          </div>
          <h3>Save Favorites</h3>
          <p>Create your personal library of favorite books</p>
        </div>
      </div>

      <div className="hl-how-it-works">
        <h2>How It Works</h2>
        <div className="hl-steps">
          <div className="hl-step">
            <span>1</span>
            <p>Browse our collection and find books you love</p>
          </div>
          <div className="hl-step">
            <span>2</span>
            <p>Read online or download for offline reading</p>
          </div>
          <div className="hl-step">
            <span>3</span>
            <p>Rate and review books to help others</p>
          </div>
        </div>
      </div>

      <div className="hl-call-to-action">
        <h2>Ready to Start Reading?</h2>
        <p>Join our community of readers and discover your next favorite book</p>
        <button className="hl-cta-button">Get Started</button>
      </div>
    </div>
  );
};

export default LearnMore;
