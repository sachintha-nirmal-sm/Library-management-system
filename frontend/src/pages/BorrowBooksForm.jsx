import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BorrowBooksForm.css';

const BorrowBooksForm = () => {
  const navigate = useNavigate();

  const [bookDetails, setBookDetails] = useState({
    isbn: '',
    bookName: '',
    author: '',
    category: '',
    publishedDate: '',
  });

  const [borrowerDetails, setBorrowerDetails] = useState({
    userId: '',
    borrowerName: '',
    contactNumber: '',
    borrowDate: new Date().toISOString().split('T')[0], // today
  });

  const handleBookDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name === 'isbn' && (!/^[0-9]{0,6}$/.test(value) || value.length > 6)) return; // Validate ISBN to allow only up to 6 digits
    if ((name === 'bookName' || name === 'author') && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === 'publishedDate' && new Date(value) > new Date()) return; // Ensure published date is in the past
    setBookDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBorrowerDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId' && value.length > 6) return;
    if (name === 'contactNumber' && !/^\d*$/.test(value)) return;
    if (name === 'borrowDate' && value !== new Date().toISOString().split('T')[0]) {
      alert('Borrow Date must be today.');
      return;
    }
    setBorrowerDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (bookDetails.isbn.length !== 10) {
      alert('ISBN must be exactly 10 digits.');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(bookDetails.bookName)) {
      alert('Book Name should only contain letters.');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(bookDetails.author)) {
      alert('Author Name should only contain letters.');
      return false;
    }
    if (bookDetails.publishedDate > new Date().toISOString().split('T')[0]) {
      alert('Published Date cannot be a future date.');
      return false;
    }
    if (!/^[A-Za-z0-9]{6}$/.test(borrowerDetails.userId)) {
      alert('User ID must be exactly 6 alphanumeric characters.');
      return false;
    }
    if (borrowerDetails.contactNumber.length !== 10) {
      alert('Contact Number must be exactly 10 digits.');
      return false;
    }
    if (borrowerDetails.borrowDate !== new Date().toISOString().split('T')[0]) {
      alert('Borrow Date must be today.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      isbn:           bookDetails.isbn,
      bookName:       bookDetails.bookName,
      author:         bookDetails.author,
      category:       bookDetails.category,
      publishedDate:  bookDetails.publishedDate,
      userId:         borrowerDetails.userId,
      borrowerName:   borrowerDetails.borrowerName,
      contactNumber:  borrowerDetails.contactNumber,
      borrowDate:     borrowerDetails.borrowDate,
    };

    try {
      const res = await fetch('http://localhost:5000/api/borrowbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Backend error:', err);
        alert('Submission failed: ' + (err.msg || res.statusText));
        return;
      }

      await res.json(); // consume response
      alert('Book borrowed successfully!');
      navigate('/transactions', { state: { borrowedBook: payload } });

      // reset form
      setBookDetails({
        isbn: '', bookName: '', author: '', category: '', publishedDate: '',
      });
      setBorrowerDetails({
        userId: '', borrowerName: '', contactNumber: '',
        borrowDate: new Date().toISOString().split('T')[0],
      });

    } catch (networkError) {
      console.error('Network error:', networkError);
      alert('Network error — please try again.');
    }
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
              <input
                type="text"
                name="isbn"
                value={bookDetails.isbn}
                onChange={handleBookDetailsChange}
                maxLength="10"
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
              <select
                name="category"
                value={bookDetails.category}
                onChange={handleBookDetailsChange}
                required
              >
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
              <input
                type="date"
                name="publishedDate"
                value={bookDetails.publishedDate}
                onChange={handleBookDetailsChange}
                max={new Date().toISOString().split('T')[0]} // Restrict to past dates
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Borrower Details</h2>
            <div className="form-group">
              <label>User ID:</label>
              <input
                type="text"
                name="userId"
                value={borrowerDetails.userId}
                onChange={handleBorrowerDetailsChange}
                maxLength="6"
                required
              />
            </div>
            <div className="form-group">
              <label>Name of Borrower:</label>
              <input
                type="text"
                name="borrowerName"
                value={borrowerDetails.borrowerName}
                onChange={handleBorrowerDetailsChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={borrowerDetails.contactNumber}
                onChange={handleBorrowerDetailsChange}
                maxLength="10"
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
          </div>
        </div>

        <div className="button-container">
          <button type="submit">Borrow</button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowBooksForm;
