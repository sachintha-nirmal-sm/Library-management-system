import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BorrowUpdate.css';

const UpdateBorrowedBookForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the book data from location state
  const { book } = location.state || {};
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [bookName, setBookName] = useState(book?.bookName || '');
  const [category, setCategory] = useState(book?.category || '');
  const [borrowerName, setBorrowerName] = useState(book?.borrowerName || '');
  const [borrowDate] = useState(book?.borrowDate || ''); // readonly

  useEffect(() => {
    if (!book) {
      navigate('/transactions'); // Redirect if no book data is available
    }
  }, [book, navigate]);

  const handleUpdate = async () => {
    const updatedBook = {
      isbn,
      bookName,
      category,
      borrowerName,
      borrowDate, // send unchanged borrowDate as well
    };

    try {
      const response = await fetch(`http://localhost:5000/api/borrowbooks/${book._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });

      if (response.ok) {
        alert('Book updated successfully!');
        navigate('/transactions');
      } else {
        alert('Failed to update the book.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('An error occurred while updating.');
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="update-form-container">
      <h2>Update Borrowed Book</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>ISBN:</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <label>Title:</label>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Borrower:</label>
        <input
          type="text"
          value={borrowerName}
          onChange={(e) => setBorrowerName(e.target.value)}
        />

        <label>Borrow Date:</label>
        <input type="text" value={borrowDate} disabled />

        <div className="button-group">
          <button className="update-btn" type="button" onClick={handleUpdate}>
            Update
          </button>
          <button className="cancel-btn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBorrowedBookForm;