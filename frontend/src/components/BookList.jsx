import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BookList.css';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading books. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase().trim();
      const searchFields = [
        book.title,
        book.author,
        book.genre,
        book.isbn,
        book.description
      ];

      return searchFields.some(field => 
        (field?.toLowerCase() || '').includes(searchLower)
      );
    });
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [searchTerm, books]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'publishedYear') {
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (isbn) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${isbn}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete book');
        }
        
        // Refresh the book list after successful deletion
        fetchBooks();
      } catch (err) {
        setError('Error deleting book. Please try again.');
      }
    }
  };

  const handleEdit = (isbn) => {
    navigate(`/a-updatebook/${isbn}`);
  };

  const getCategoryCounts = () => {
    const categoryCounts = {};
    books.forEach(book => {
      categoryCounts[book.genre] = (categoryCounts[book.genre] || 0) + 1;
    });
    return categoryCounts;
  };

  if (loading) {
    return (
      <div className="bl-loading-container">
        <div className="bl-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bl-error-container">
        {error}
      </div>
    );
  }

  return (
    <div className="bl-book-list-container">
      <div className="bl-book-list-header">
        <h2>Book List</h2>
        <div className="bl-header-actions">
          <div className="bl-search-box">
            <input
              type="text"
              className="bl-search-input"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="bl-search-icon">🔍</span>
            {searchTerm && (
              <button
                className="bl-clear-search"
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          <button 
            className="bl-add-book-button"
            onClick={() => navigate('/a-bookform')}
          >
            Add New Book
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="bl-search-results-info">
          Showing {filteredBooks.length} results
        </div>
      )}

      <div className="bl-category-summary">
        <h3>Books by Category</h3>
        <div className="bl-category-grid">
          {Object.entries(getCategoryCounts()).map(([category, count]) => (
            <div key={category} className="bl-category-card">
              <div className="bl-category-icon">📚</div>
              <div className="bl-category-info">
                <span className="bl-category-name">{category}</span>
                <span className="bl-category-count">{count} {count === 1 ? 'Book' : 'Books'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bl-table-container">
        <table className="bl-book-table">
          <thead>
            <tr>
              <th
                className={`sortable ${sortConfig.key === 'title' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('title')}
              >
                Title
              </th>
              <th
                className={`sortable ${sortConfig.key === 'author' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('author')}
              >
                Author
              </th>
              <th
                className={`sortable ${sortConfig.key === 'genre' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('genre')}
              >
                Genre
              </th>
              <th
                className={`sortable ${sortConfig.key === 'publishedYear' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('publishedYear')}
              >
                Published Year
              </th>
              <th
                className={`sortable ${sortConfig.key === 'rating' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('rating')}
              >
                Rating
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.isbn}>
                <td>
                  <div className="bl-book-title-cell">
                    <div className="bl-book-cover-container">
                      <img 
                        src={book.coverImage 
                          ? (book.coverImage.startsWith('data:image') 
                              ? book.coverImage 
                              : `http://localhost:5000/uploads/${book.coverImage}`)
                          : 'https://via.placeholder.com/100x150?text=No+Cover'
                        } 
                        alt={`${book.title} cover`} 
                        className="bl-book-cover" 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x150?text=No+Cover';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <span className="bl-book-title">{book.title}</span>
                  </div>
                </td>
                <td>{book.author}</td>
                <td>
                  <span className="bl-category-badge">{book.genre}</span>
                </td>
                <td>{book.publishedYear}</td>
                <td>
                  <div className="bl-rating-cell">
                    {book.rating ? `${book.rating} / 5` : 'Not Rated'}
                  </div>
                </td>
                <td>
                  <div className="bl-action-buttons">
                    <button
                      className="bl-edit-button"
                      onClick={() => handleEdit(book.isbn)}
                    >
                      Edit
                    </button>
                    <button
                      className="bl-delete-button"
                      onClick={() => handleDelete(book.isbn)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bl-pagination">
          <button
            className="bl-page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`bl-page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="bl-page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {filteredBooks.length === 0 && (
        <div className="bl-no-results">
          <p>No books found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
