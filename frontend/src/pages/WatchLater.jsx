import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookmark, FaEye, FaTrash, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import BookModal from '../components/BookModal';
import './WatchLater.css';

const WatchLater = () => {
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storedBooks, setStoredBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch watch later list from the backend
    axiosInstance.get('/api/watch-later')
      .then(response => setWatchLaterList(response.data))
      .catch(error => console.error('Error fetching watch later list:', error));

    // Fetch all books from the backend
    axiosInstance.get('/api/books')
      .then(response => setStoredBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleViewDetails = (watchLaterItem) => {
    const fullBook = storedBooks.find(book => 
      book.title === watchLaterItem.title && 
      book.author === watchLaterItem.author
    );

    if (fullBook) {
      navigate(`/book/${fullBook.isbn || fullBook._id}`); // Navigate to BookDetails with ISBN or ID
    } else {
      alert('Book details not found. It may have been removed from the library.');
    }
  };

  const handleRemoveFromWatchLater = (watchLaterItem) => {
    if (window.confirm('Are you sure you want to remove this book from your watch later list?')) {
      axiosInstance.delete(`/api/watch-later/${watchLaterItem.bookId}`)
        .then(() => {
          const updatedList = watchLaterList.filter(item => item.bookId !== watchLaterItem.bookId);
          setWatchLaterList(updatedList);
        })
        .catch(error => console.error('Error removing book from watch later list:', error));
    }
  };

  return (
    <div className="wl-container">
      <nav className="wl-nav">
        <button className="wl-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1>Watch Later List</h1>
      </nav>

      <main className="wl-main-content">
        {watchLaterList.length === 0 ? (
          <div className="wl-empty-state">
            <FaBookmark className="wl-empty-icon" />
            <h2>Your Watch Later List is Empty</h2>
            <p>Add books to your watch later list to keep track of them.</p>
            <Link to="/home2" className="wl-browse-button">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="wl-books-grid">
            {watchLaterList.map((item, index) => (
              <div key={index} className="wl-book-card">
                <div className="wl-book-info">
                  <h3>{item.title}</h3>
                  <p className="wl-book-author">{item.author}</p>
                  <div className="wl-book-meta">
                    <span className="wl-book-category">{item.category}</span>
                    <span className="wl-book-genre">{item.genre}</span>
                    <span className="wl-book-date">
                      Added: {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="wl-book-actions">
                  <button 
                    className="wl-view-button"
                    onClick={() => handleViewDetails(item)}
                  >
                    <FaEye /> View Details
                  </button>
                  <button 
                    className="wl-remove-button"
                    onClick={() => handleRemoveFromWatchLater(item)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBook(null);
          }} 
        />
      )}
    </div>
  );
};

export default WatchLater;
