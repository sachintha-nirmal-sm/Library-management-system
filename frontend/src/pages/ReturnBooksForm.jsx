import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReturnBooksForm.css'; // Import the CSS file for styling

const ReturnBooksForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the book details from location.state
  const book = location.state?.book || {};

  // State for Book Details
  const [bookDetails, setBookDetails] = useState({
    isbn: book.isbn || '',
    bookName: book.bookName || '',
    author: book.author || '',
    category: book.category || '',
    publishedDate: book.publishedDate || '',
  });

  // State for Borrower Details
  const [borrowerDetails, setBorrowerDetails] = useState({
    name: book.borrowerName || '',
    borrowDate: book.borrowDate || '', // Added Borrow Date field
    returnDate: '', // Return Date will be manually entered
  });

  // Handle Book Details Input Change
  const handleBookDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  // Handle Borrower Details Input Change
  const handleBorrowerDetailsChange = (e) => {
    const { name, value } = e.target;
    setBorrowerDetails({ ...borrowerDetails, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a returned book object
    const returnedBook = {
      isbn: bookDetails.isbn, // Include ISBN
      bookName: bookDetails.bookName,
      borrowerName: borrowerDetails.name,
      borrowDate: borrowerDetails.borrowDate, // Include Borrow Date
      returnDate: borrowerDetails.returnDate, // Include Return Date
      fine: calculateFine(borrowerDetails.borrowDate, borrowerDetails.returnDate), // Calculate Fine
    };

    // Pass the returned book data to the parent component
    // navigate to transactions page and pass the returned book as state
    navigate('/transactions', { state: { returnedBook } });

    // Reset form fields
    setBookDetails({
      isbn: '',
      bookName: '',
      author: '',
      category: '',
      publishedDate: '',
    });
    setBorrowerDetails({
      name: '',
      borrowDate: '',
      returnDate: '',
    });

    alert('Book returned successfully!');
  };

  // Function to calculate fine (example logic)
  const calculateFine = (borrowDate, returnDate) => {
    const borrow = new Date(borrowDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD - borrow);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const fineRate = 5; // $5 per day
    return diffDays > 14 ? (diffDays - 14) * fineRate : 0; // Fine after 14 days
  };

  // Handle Cancel Button Click
  const handleCancel = () => {
    // Reset form fields
    setBookDetails({
      isbn: '',
      bookName: '',
      author: '',
      category: '',
      publishedDate: '',
    });
    setBorrowerDetails({
      name: '',
      borrowDate: '',
      returnDate: '',
    });
    alert('Form canceled!');
  };

  return (
    <div className="return-books-form">
      <h1>Return Books Form</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Book Details Form */}
          <div className="form-section">
            <h2>Book Details</h2>
            <div className="form-group">
              <label>ISBN:</label>
              <input
                type="text"
                name="isbn"
                value={bookDetails.isbn}
                onChange={handleBookDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Book Name:</label>
              <input
                type="text"
                name="bookName"
                value={bookDetails.bookName}
                onChange={handleBookDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={bookDetails.author}
                onChange={handleBookDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={bookDetails.category}
                onChange={handleBookDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Published Date:</label>
              <input
                type="date"
                name="publishedDate"
                value={bookDetails.publishedDate}
                onChange={handleBookDetailsChange}
                required
              />
            </div>
          </div>

          {/* Borrower Details Form */}
          <div className="form-section">
            <h2>Borrower Details</h2>
            <div className="form-group">
              <label>Name of Borrower:</label>
              <input
                type="text"
                name="name"
                value={borrowerDetails.name}
                onChange={handleBorrowerDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Borrow Date:</label>
              <input
                type="date"
                name="borrowDate"
                value={borrowerDetails.borrowDate}
                onChange={handleBorrowerDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Return Date:</label>
              <input
                type="date"
                name="returnDate"
                value={borrowerDetails.returnDate}
                onChange={handleBorrowerDetailsChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="button-container">
          <button type="submit">Return</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnBooksForm;
