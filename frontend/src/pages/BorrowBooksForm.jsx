import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BorrowBooksForm.css';

const BorrowBooksForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // State for Book Details
  const [bookDetails, setBookDetails] = useState({
    isbn: '',
    bookName: '',
    author: '',
    category: '',  // Category field
    publishedDate: '',
  });

  // State for Borrower Details
  const [borrowerDetails, setBorrowerDetails] = useState({
    userId: '',
    name: '',
    contactNumber: '',
    borrowDate: '',
  });

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
  const handleSubmit = (e) => {
    e.preventDefault();

    const borrowedBook = {
      isbn: bookDetails.isbn,
      bookName: bookDetails.bookName,
      borrowerName: borrowerDetails.name,
      borrowDate: borrowerDetails.borrowDate,
      category: bookDetails.category,  // Pass the category here
    };

    // Navigate to Transactions page and pass the borrowed book details
    navigate('/transactions', { state: { borrowedBook } });

    // Reset Form Fields
    setBookDetails({
      isbn: '',
      bookName: '',
      author: '',
      category: '',
      publishedDate: '',
    });
    setBorrowerDetails({
      userId: '',
      name: '',
      contactNumber: '',
      borrowDate: '',
    });

    alert('Book borrowed successfully!');
  };

  // Handle Cancel Button (Reset form and navigate back)
  const handleCancel = () => {
    // Reset Form Fields
    setBookDetails({
      isbn: '',
      bookName: '',
      author: '',
      category: '',
      publishedDate: '',
    });
    setBorrowerDetails({
      userId: '',
      name: '',
      contactNumber: '',
      borrowDate: '',
    });

    // Navigate to previous page (e.g., Transactions page)
    navigate('/transactions');
  };

  return (
    <div className="borrow-books-form">
      <h1>Borrow Books Form</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-section">
            <h2>Book Details</h2>
            <div className="form-group">
              <label>ISBN:</label>
              <input type="text" name="isbn" value={bookDetails.isbn} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Book Name:</label>
              <input type="text" name="bookName" value={bookDetails.bookName} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input type="text" name="author" value={bookDetails.author} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select name="category" value={bookDetails.category} onChange={handleBookDetailsChange} required>
                <option value="">Select Category</option>
                <option value="Novel">Novel</option>
                <option value="Horror">Horror</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery&thriler">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div className="form-group">
              <label>Published Date:</label>
              <input type="date" name="publishedDate" value={bookDetails.publishedDate} onChange={handleBookDetailsChange} required />
            </div>
          </div>

          <div className="form-section">
            <h2>Borrower Details</h2>
            <div className="form-group">
              <label>User ID:</label>
              <input type="text" name="userId" value={borrowerDetails.userId} onChange={handleBorrowerDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Name of Borrower:</label>
              <input type="text" name="name" value={borrowerDetails.name} onChange={handleBorrowerDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <input type="text" name="contactNumber" value={borrowerDetails.contactNumber} onChange={handleBorrowerDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Borrow Date:</label>
              <input type="date" name="borrowDate" value={borrowerDetails.borrowDate} onChange={handleBorrowerDetailsChange} required />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit">Borrow</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BorrowBooksForm;
