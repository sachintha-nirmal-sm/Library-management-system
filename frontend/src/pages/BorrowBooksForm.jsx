import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI, borrowingAPI } from '../services/api';
import './BorrowBooksForm.css';

const BorrowBooksForm = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for Book Details
  const [bookDetails, setBookDetails] = useState({
    bookId: '',
    bookName: '',
    author: '',
    category: '',
  });

  // State for Borrower Details
  const [borrowerDetails, setBorrowerDetails] = useState({
    userId: '',
    name: '',
    contactNumber: '',
    borrowDate: new Date().toISOString().split('T')[0],
  });

  // Load available books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookAPI.getAllBooks();
        const availableBooks = response.data.filter(book => book.available);
        setBooks(availableBooks);
      } catch (err) {
        setError('Failed to load books');
        console.error('Error fetching books:', err);
      }
    };

    fetchBooks();
  }, []);

  // Handle Input Change for Book Details
  const handleBookDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  // Handle Input Change for Borrower Details
  const handleBorrowerDetailsChange = (e) => {
    const { name, value } = e.target;
    setBorrowerDetails({ ...borrowerDetails, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Borrow the book
      await borrowingAPI.borrowBook(bookDetails.bookId);
      
      // Reset form
      setBookDetails({
        bookId: '',
        bookName: '',
        author: '',
        category: '',
      });
      setBorrowerDetails({
        userId: '',
        name: '',
        contactNumber: '',
        borrowDate: new Date().toISOString().split('T')[0],
      });

      alert('Book borrowed successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to borrow book');
      console.error('Error borrowing book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrow-form-container">
      <h2>Borrow a Book</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Book</label>
          <select
            name="bookId"
            value={bookDetails.bookId}
            onChange={handleBookDetailsChange}
            required
          >
            <option value="">Select a book</option>
            {books.map(book => (
              <option key={book._id} value={book._id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Borrower Name</label>
          <input
            type="text"
            name="name"
            value={borrowerDetails.name}
            onChange={handleBorrowerDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={borrowerDetails.contactNumber}
            onChange={handleBorrowerDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Borrow Date</label>
          <input
            type="date"
            name="borrowDate"
            value={borrowerDetails.borrowDate}
            onChange={handleBorrowerDetailsChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Borrowing...' : 'Borrow Book'}
        </button>
      </form>
    </div>
  );
};

export default BorrowBooksForm;
