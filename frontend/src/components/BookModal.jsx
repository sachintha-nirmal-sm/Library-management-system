import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaDownload, FaBookOpen, FaBookmark, FaArrowLeft, FaArrowRight, 
  FaPlay, FaPause, FaStop, FaStar 
} from 'react-icons/fa';
import './BookModal.css';

const BookModal = ({ book, onClose }) => {
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userRating, setUserRating] = useState(0); // User's selected rating
  const [submitted, setSubmitted] = useState(false); // Track if rating is submitted
  const synth = window.speechSynthesis;

  const totalPages = book?.pages || 320;
  if (!book) return null;

  const handleDownload = () => {
    alert(`Downloading ${book.title}...`);
  };

  const handleViewBook = () => {
    setIsReading(true);
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prev => {
      if (direction === 'next' && prev < totalPages) return prev + 1;
      if (direction === 'prev' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleSpeak = () => {
    const text = `Reading Page ${currentPage}. This is a sample content of the book.`;
    if (synth.speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };
  };

  const handlePause = () => {
    if (synth.speaking) {
      synth.pause();
      setIsSpeaking(false);
    }
  };

  const handleResume = () => {
    if (synth.paused) {
      synth.resume();
      setIsSpeaking(true);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  const handleRating = (rating) => {
    if (!submitted) setUserRating(rating);
  };

  const submitRating = () => {
    if (userRating > 0) {
      setSubmitted(true);
      alert(`You rated this book ${userRating} stars!`);
      // Here, you can send the rating to the backend API if needed.
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {!isReading ? (
          <>
            <div className="modal-header">
              <button className="close-button" onClick={onClose}>
                <FaTimes />
              </button>
              <h2 className="modal-title">{book.title}</h2>
              <p className="modal-author">by {book.author}</p>
              <div className="book-meta">
                <span className="book-genre">
                  <FaBookmark /> {book.genre}
                </span>
          
              </div>
            </div>

            <div className="modal-content">
              <div className="content-section">
                <h3 className="section-title">Description</h3>
                <p className="book-description">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              <div className="book-details">
                <div className="detail-item">
                  <span className="detail-label">Published:</span>
                  <span className="detail-value">{book.publishedDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pages:</span>
                  <span className="detail-value">{book.pages} pages</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Format:</span>
                  <span className="detail-value">{book.formats?.join(', ') || 'PDF, EPUB, MOBI'}</span>
                </div>
              </div>

              {/* User Rating Section */}
              <div className="rating-section">
                <h3 className="section-title">Rate this Book</h3>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= userRating ? 'selected' : ''}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
                <button 
                  className="btn btn-primary rate-btn" 
                  onClick={submitRating} 
                  disabled={submitted}
                >
                  Submit Rating
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleViewBook}>
                <FaBookOpen /> View Book
              </button>
              <button className="btn btn-secondary" onClick={handleDownload}>
                <FaDownload /> Download PDF
              </button>
            </div>
          </>
        ) : (
          <div className="reader-view">
            <div className="reader-header">
              <button className="close-button" onClick={() => setIsReading(false)}>
                <FaArrowLeft /> Back
              </button>
              <h3>{book.title}</h3>
              <div className="page-info">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="page-content">
              <p>Page {currentPage} Content...</p>
            </div>

            <div className="navigation-controls">
              <button 
                className="nav-btn" 
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                <FaArrowLeft /> Previous
              </button>
              <button 
                className="nav-btn" 
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
              >
                Next <FaArrowRight />
              </button>
            </div>

            <div className="speech-controls">
              <button className="btn" onClick={handleSpeak} disabled={isSpeaking}>
                <FaPlay /> Play
              </button>
              <button className="btn" onClick={handlePause}>
                <FaPause /> Pause
              </button>
              <button className="btn" onClick={handleResume}>
                <FaPlay /> Resume
              </button>
              <button className="btn" onClick={handleStop}>
                <FaStop /> Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookModal;
