import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaBookmark, FaArrowLeft, FaStar } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import './BookDetails.css';

const DEFAULT_COVER = '/assets/img/default-cover.png'; // Updated to use a locally hosted image

const BookDetails = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/books/${isbn}`);
        setBook(response.data);
        setPdfUrl(response.data.pdfUrl || null); // Assuming the API provides a 'pdfUrl' field
      } catch (err) {
        setError('Error loading book details. Please try again later.');
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchLaterList = async () => {
      try {
        const response = await axiosInstance.get('/api/watch-later');
        setWatchLaterList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching watch later list:', error);
        setWatchLaterList([]);
      }
    };

    fetchBookDetails();
    fetchWatchLaterList();
  }, [isbn]);

  const handleWatchLater = async () => {
    try {
      const isBookInList = watchLaterList.some(item => item.bookId === book._id);

      if (isBookInList) {
        await axiosInstance.delete(`/api/watch-later/${book._id}`);
        setWatchLaterList(prevList => prevList.filter(item => item.bookId !== book._id));
        alert('Removed from Watch Later');
      } else {
        const response = await axiosInstance.post('/api/watch-later', { bookId: book._id });
        setWatchLaterList(prevList => [...prevList, response.data]);
        alert('Added to Watch Later');
      }
    } catch (error) {
      console.error('Error updating watch later list:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!submitted) {
      try {
        const response = await axiosInstance.put(`/api/books/rate/${book._id}`, {
          rating: rating
        });
        setUserRating(rating);
        setSubmitted(true);
        setBook(prev => ({ ...prev, rating: rating }));
        alert('Rating submitted successfully!');
      } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating. Please try again.');
      }
    }
  };

  const getBookCover = () => {
    if (book?.coverImage && !imageError) {
      if (book.coverImage.startsWith('data:image') || book.coverImage.startsWith('http')) {
        return book.coverImage;
      }
      if (book.coverImage.startsWith('/uploads/')) {
        return `http://localhost:5000${book.coverImage}`;
      }
      return `http://localhost:5000/uploads/${book.coverImage}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="book-details-loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-error">
        <p>Book not found</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="book-details-content">
        <div className="book-cover-section">
          {getBookCover() ? (
            <img 
              src={getBookCover()} 
              alt={book.title}
              className="book-cover"
              onError={() => setImageError(true)}
            />
          ) : imageError ? (
            <img 
              src={DEFAULT_COVER}
              alt="No Cover"
              className="book-cover"
            />
          ) : (
            <div className="no-cover">
              <FaBook />
              <span>{book.title}</span>
            </div>
          )}
        </div>

        <div className="book-info-section">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
          <p className="genre">{book.genre}</p>
          
          <div className="book-description">
            <h2>Description</h2>
            <p>{book.description || 'No description available.'}</p>
          </div>

          <div className="book-meta">
            <div className="meta-item">
              <span className="label">Published Year:</span>
              <span className="value">{book.publishedYear || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <span className="label">ISBN:</span>
              <span className="value">{book.isbn}</span>
            </div>
            <div className="meta-item">
              <span className="label">Availability:</span>
              <span className={`value ${book.available ? 'available' : 'unavailable'}`}>
                {book.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="rating-section">
            <h2>Rating</h2>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star ${star <= (book.rating || userRating) ? 'selected' : ''}`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            <p className="rating-text">
              {book.rating ? `${book.rating} / 5` : 'Not rated yet'}
            </p>
          </div>

          <div className="action-buttons">
            <button 
              className={`watch-later-button ${
                watchLaterList.some(item => item.bookId === book._id) ? 'active' : ''
              }`}
              onClick={handleWatchLater}
            >
              <FaBookmark />
              {watchLaterList.some(item => item.bookId === book._id) 
                ? 'Remove from Watch Later' 
                : 'Add to Watch Later'}
            </button>
          </div>
        </div>
      </div>

      <div className="view-pdf-section">
        <h2>View PDF</h2>
        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="view-pdf-button">
            View PDF
          </a>
        ) : (
          <p>No PDF available for this book.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;