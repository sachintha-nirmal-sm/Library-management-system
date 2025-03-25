import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BorrowUpdate.css';

const UpdateBorrowedBookForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the book data and index from location state
  const { book, index } = location.state || {};
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [bookName, setBookName] = useState(book?.bookName || '');
  const [category, setCategory] = useState(book?.category || '');
  const [borrowerName, setBorrowerName] = useState(book?.borrowerName || '');
  const [borrowDate] = useState(book?.borrowDate || ''); // borrowDate should not be updated

  useEffect(() => {
    if (!book) {
      navigate('/transactions'); // Redirect if no book data is available
    }
  }, [book, navigate]);

  const handleUpdate = () => {
    // Update the book in the parent component (using localStorage for simplicity here)
    const updatedBook = {
      ...book,
      isbn,
      bookName,
      category,
      borrowerName,
    };

    const storedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    storedBooks[index] = updatedBook;

    // Save the updated list back to localStorage
    localStorage.setItem('borrowedBooks', JSON.stringify(storedBooks));

    // Redirect to the transactions page
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

        <button onClick={handleUpdate}>Update</button>
      </form>
    </div>
  );
};

export default UpdateBorrowedBookForm;
