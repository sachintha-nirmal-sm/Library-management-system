import React, { useState, useEffect } from 'react';
import './dashboard.css'; // Import the CSS file for styling

const LibraryManagement = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);

  // Load books data from localStorage on page load
  useEffect(() => {
    const storedBorrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const storedReturnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];
    
    setBorrowedBooks(storedBorrowedBooks);
    setReturnedBooks(storedReturnedBooks);
  }, []);

  // Save books data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));
  }, [borrowedBooks, returnedBooks]);

  return (
    <div className="container">
      <h1>LIBRARY MANAGEMENT SYSTEM</h1>
      <p>You are logged in as Librarian (For Library Management)</p>

      {/* Squares for Books, Borrowed Books, and Available Books */}
      <div className="squares-container">
        <div className="square books">
          <h2>Books</h2>
          <p>12</p>
        </div>
        <div className="square borrowed-books">
          <h2>Borrowed Books</h2>
          <p>{borrowedBooks.length}</p>
        </div>
        <div className="square available-books">
          <h2>Available Books</h2>
          <p>{12 - borrowedBooks.length}</p>
        </div>
      </div>

      {/* Tables displayed horizontally */}
      <div className="tables-container">
        <div className="table-box">
          <h2>Transaction History (Borrowed Books)</h2>
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.isbn}</td>
                  <td>{book.bookName}</td>
                  <td>{book.borrowerName}</td>
                  <td>{book.borrowDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h2>Transaction History (Returned Books)</h2>
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {returnedBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.isbn}</td>
                  <td>{book.bookName}</td>
                  <td>{book.borrowerName}</td>
                  <td>{book.borrowDate}</td>
                  <td>{book.returnDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;
