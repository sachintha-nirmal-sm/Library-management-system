import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaBookmark, FaEye, FaStar } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchLaterList, setWatchLaterList] = useState([]);

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setLoading(true);
        // Decode the category name from URL and capitalize it
        const decodedCategory = decodeURIComponent(categoryName);
        const formattedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
        
        const response = await axiosInstance.get(`/api/books/category/${formattedCategory}`);
        setBooks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Error loading books. Please try again later.');
        console.error('Error fetching category books:', err);
        setBooks([]);
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

    fetchCategoryBooks();
    fetchWatchLaterList();
  }, [categoryName]);

  const handleWatchLater = async (book) => {
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

  const getBookCover = (book) => {
    if (book.coverImage) {
      if (book.coverImage.startsWith('http')) {
        return book.coverImage;
      }
      return `http://localhost:5000/uploads/${book.coverImage}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="category-loading">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="category-books-container">
      <div className="category-header">
        <h1>{decodeURIComponent(categoryName).charAt(0).toUpperCase() + decodeURIComponent(categoryName).slice(1)} Books</h1>
        <p>{books.length} {books.length === 1 ? 'book' : 'books'} found</p>
      </div>

      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="category-book-card">
              <div className="category-book-cover">
                {getBookCover(book) ? (
                  <img 
                    src={getBookCover(book)}
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div class="category-no-cover">
                          <FaBook />
                          <span>${book.title}</span>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="category-no-cover">
                    <FaBook />
                    <span>{book.title}</span>
                  </div>
                )}
              </div>
              <div className="category-book-info">
                <h3>{book.title}</h3>
                <p className="category-book-author">{book.author}</p>
                <span className="category-book-category">{book.category}</span>
                <div className="category-book-rating">
                  {book.rating
                    ? (
                      <>
                        <span className="category-rating-count">{book.rating}</span>
                        <span className="category-rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              color={i < Math.round(book.rating) ? "#ffd700" : "#e0e0e0"}
                              style={{ marginLeft: 1, marginRight: 1 }}
                            />
                          ))}
                        </span>
                      </>
                    )
                    : <span className="category-rating-count">Not Rated</span>
                  }
                </div>
                <div className="category-book-actions">
                  <button 
                    className="category-view-button"
                    onClick={() => navigate(`/book/${book.isbn}`)}
                  >
                    <FaEye /> View Details
                  </button>
                  <button 
                    className={`category-watch-later-button ${
                      watchLaterList.some(item => item.bookId === book._id) ? 'active' : ''
                    }`}
                    onClick={() => handleWatchLater(book)}
                  >
                    <FaBookmark />
                    {watchLaterList.some(item => item.bookId === book._id) 
                      ? 'Remove from Watch Later' 
                      : 'Add to Watch Later'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books-message">
            <p>No books found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
