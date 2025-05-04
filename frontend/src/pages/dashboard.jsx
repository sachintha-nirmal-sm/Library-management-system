import React, { useState, useEffect } from 'react';
import { bookAPI, borrowingAPI } from '../services/api';
import './dashboard.css'; // Import the CSS file for styling

const LibraryManagement = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books and borrowed books data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksResponse, borrowingsResponse] = await Promise.all([
          bookAPI.getAllBooks(),
          borrowingAPI.getAllBorrowings()
        ]);
        
        setBooks(booksResponse.data);
        setBorrowedBooks(borrowingsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const availableBooks = books.filter(book => book.available);

  return (
    <div className="container">
      <h1>LIBRARY MANAGEMENT SYSTEM</h1>
      <p>You are logged in as Librarian (For Library Management)</p>

      {/* Squares for Books, Borrowed Books, and Available Books */}
      <div className="squares-container">
        <div className="square books">
          <h2>Total Books</h2>
          <p>{books.length}</p>
        </div>
        <div className="square borrowed-books">
          <h2>Borrowed Books</h2>
          <p>{borrowedBooks.length}</p>
        </div>
        <div className="square available-books">
          <h2>Available Books</h2>
          <p>{availableBooks.length}</p>
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
              {borrowedBooks.map((book, index) => (
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
