
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaTimes, FaBookOpen, FaBookmark, FaArrowLeft, FaArrowRight, 
  FaPlay, FaPause, FaStop, FaStar, FaFilePdf 
} from 'react-icons/fa';
import './BookModal.css';

const BookModal = ({ book, onClose }) => {
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const synth = window.speechSynthesis;

  if (!book) {
    console.log('No book data provided to modal');
    return null;
  }

  const totalPages = book.pages || 320;

  const handleViewBook = () => {
    if (book.pdfFile) {
      setShowPdf(true);
    } else {
      setIsReading(true);
      setCurrentPage(1);
    }
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

  const submitRating = async () => {
    if (userRating > 0) {
      setSubmitted(true);
      alert(`You rated this book ${userRating} stars!`);

      try {
        // Ensure the book has a valid ID
        const bookId = book.id || book._id;
        if (!bookId) {
          throw new Error('Book ID is missing');
        }

        // Send the rating to the backend
        const response = await axios.put(`http://localhost:5000/api/books/rate/${bookId}`, {
          rating: userRating,
        });

        console.log('Rating updated successfully:', response.data);

        // Update the book's rating in the parent component
        if (book.onRatingUpdate) {
          book.onRatingUpdate(bookId, userRating);
        }
      } catch (error) {
        console.error('Error updating rating:', error);
        alert('Failed to update rating. Please try again later.');
      }
    }
  };

  if (showPdf) {
    return (
      <div className="bm-modal-overlay">
        <div className="bm-modal-container bm-pdf-container">
          <div className="bm-pdf-header">
            <button className="bm-back-button" onClick={() => setShowPdf(false)}>
              <FaArrowLeft /> Back to Detailssssss
            </button>
            <h3>{book.title || 'Untitled'}</h3>
            <button className="bm-close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="bm-pdf-viewer">
            <iframe
              src={book.pdfFile}
              title={`${book.title || 'Book'} PDF`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal-container" onClick={(e) => e.stopPropagation()}>
        {!isReading ? (
          <>
            <div className="bm-modal-header">
              <button className="bm-close-button" onClick={onClose}>
                <FaTimes />
              </button>
              <div className="bm-book-header-content">
                <div className="bm-book-cover-modal">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title || 'Book Cover'} 
                      className="bm-modal-cover-image"
                    />
                  ) : (
                    <div className="bm-default-cover-modal">
                      <FaBookOpen className="bm-default-cover-icon" />
                    </div>
                  )}
                </div>
                <div className="bm-book-title-section">
                  <h2 className="bm-modal-title">{book.title || 'Untitled'}</h2>
                  <p className="bm-modal-author">by {book.author || 'Unknown'}</p>
                  <div className="bm-book-meta">
                    <span className="bm-book-genre">
                      <FaBookmark /> {book.genre || 'General'}
                    </span>
                    <span className="bm-book-category">
                      {book.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bm-modal-content">
              <div className="bm-content-section">
                <h3 className="bm-section-title">Description</h3>
                <p className="bm-book-description">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              <div className="bm-book-details">
                <div className="bm-detail-item">
                  <span className="bm-detail-label">Published:</span>
                  <span className="bm-detail-value">
                    {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="bm-detail-item">
                  <span className="bm-detail-label">Pages:</span>
                  <span className="bm-detail-value">{book.pages || 'N/A'} pages</span>
                </div>
                <div className="bm-detail-item">
                  <span className="bm-detail-label">Format:</span>
                  <span className="bm-detail-value">
                    {book.formats?.join(', ') || 'PDF'}
                  </span>
                </div>
              </div>

              <div className="bm-rating-section">
                <h3 className="bm-section-title">Rate this Book</h3>
                <div className="bm-rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`bm-star ${star <= userRating ? 'selected' : ''}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
                <button 
                  className="bm-btn bm-btn-primary bm-rate-btn" 
                  onClick={submitRating} 
                  disabled={submitted}
                >
                  Submit Rating
                </button>
              </div>
            </div>

            <div className="bm-modal-actions">
              <button 
                className="bm-btn bm-btn-primary" 
                onClick={handleViewBook}
              >
                {book.pdfFile ? (
                  <>
                    <FaFilePdf /> View PDF
                  </>
                ) : (
                  <>
                    <FaBookOpen /> Read Book
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="bm-reader-view">
            <div className="bm-reader-header">
              <button className="bm-close-button" onClick={() => setIsReading(false)}>
                <FaArrowLeft /> Back
              </button>
              <h3>{book.title || 'Untitled'}</h3>
              <div className="bm-page-info">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="bm-page-content">
              <p>Page {currentPage} Content...</p>
            </div>

            <div className="bm-navigation-controls">
              <button 
                className="bm-nav-btn" 
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                <FaArrowLeft /> Previous
              </button>
              <button 
                className="bm-nav-btn" 
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
              >
                Next <FaArrowRight />
              </button>
            </div>

            <div className="bm-speech-controls">
              <button className="bm-btn" onClick={handleSpeak} disabled={isSpeaking}>
                <FaPlay /> Play
              </button>
              <button className="bm-btn" onClick={handlePause}>
                <FaPause /> Pause
              </button>
              <button className="bm-btn" onClick={handleResume}>
                <FaPlay /> Resume
              </button>
              <button className="bm-btn" onClick={handleStop}>
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
