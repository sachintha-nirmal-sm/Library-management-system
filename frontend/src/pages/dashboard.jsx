import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const LibraryManagement = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const totalBooks = 12; // You can make this dynamic later
  const availableBooks = totalBooks - borrowedBooks.length;

  useEffect(() => {
    fetch("http://localhost:5000/api/borrowbooks")
      .then(res => res.json())
      .then(data => setBorrowedBooks(data))
      .catch(err => console.error("Failed to load borrowed books:", err));

    fetch("http://localhost:5000/api/returnbooks")
      .then(res => res.json())
      .then(data => setReturnedBooks(data))
      .catch(err => console.error("Failed to load returned books:", err));
  }, []);

  const handleDropdownClick = (page) => {
    setDropdownOpen(false);
    const routes = {
      'Start System': '/transactions',
      'Transactions History': '/dashboard',
      'Manage Books': '/manage-books',
      'User Management': '/user-management',
      'View Site': '/home1',
      'Log out': '/login'
    };
    navigate(routes[page] || '/dashboard');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu">
        <button className="dashboard-btn" onClick={() => setDropdownOpen(prev => !prev)}>Dashboard</button>
        {dropdownOpen && (
          <ul className="dropdown-menu">
            {['Start System', 'Transactions History', 'Manage Books', 'User Management', 'View Site', 'Log out']
              .map(page => (
                <li key={page} onClick={() => handleDropdownClick(page)}>{page}</li>
              ))}
          </ul>
        )}
      </div>

      <h1 className="title">LIBRARY MANAGEMENT SYSTEM</h1>
      <p className="subtitle">Welcome Devmini ! You are logged in as Librarian (For Library Management)</p>

      <div className="stats-container">
        <div className="stat-box books">
          <h2>Total Books</h2>
          <p>{totalBooks}</p>
        </div>
        <div className="stat-box borrowed">
          <h2>Borrowed Books</h2>
          <p>{borrowedBooks.length}</p>
        </div>
        <div className="stat-box available">
          <h2>Available Books</h2>
          <p>{availableBooks}</p>
        </div>
      </div>

      <div className="tables-container">
        <div className="table-section">
          <h2>Transaction History (Borrowed Books)</h2>
          <table>
            <thead>
              <tr>
                <th>ISBN</th><th>Title</th><th>Borrower</th><th>Borrow Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, idx) => (
                <tr key={idx}>
                  <td>{book.isbn}</td>
                  <td>{book.bookName}</td>
                  <td>{book.borrowerName}</td>
                  <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h2>Transaction History (Returned Books)</h2>
          <table>
            <thead>
              <tr>
                <th>ISBN</th><th>Title</th><th>Borrower</th><th>Borrow Date</th><th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {returnedBooks.map((book, idx) => (
                <tr key={idx}>
                  <td>{book.isbn}</td>
                  <td>{book.bookName}</td>
                  <td>{book.borrowerName}</td>
                  <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(book.returnDate).toLocaleDateString()}</td>
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
