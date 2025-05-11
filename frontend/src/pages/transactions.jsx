import React, { useState, useEffect, useRef } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "./transactions.css";

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [searchBorrowed, setSearchBorrowed] = useState("");
  const [searchReturned, setSearchReturned] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const borrowedTableRef = useRef(null);
  const returnedTableRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/borrowbooks")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setBorrowedBooks(data))
      .catch(err => {
        console.error("Failed loading borrowed books:", err);
        setBorrowedBooks([]); // Default to an empty array on failure
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/returnbooks")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setReturnedBooks(data))
      .catch(err => {
        console.error("Failed loading returned books:", err);
        setReturnedBooks([]); // Default to an empty array on failure
      });
  }, []);

  useEffect(() => {
    if (location.state?.borrowedBook) {
      setBorrowedBooks(b => [location.state.borrowedBook, ...b]);
    }
    if (location.state?.returnedBook) {
      setReturnedBooks(r => [location.state.returnedBook, ...r]);
    }
  }, [location.state]);

  const validateDateString = s => (typeof s === "string" ? s : new Date(s).toISOString().split('T')[0]);

  const calculateFineStatus = (borrowDate, returnDate) => {
    const diff = (new Date(validateDateString(returnDate)) - new Date(validateDateString(borrowDate))) 
                   / (1000 * 60 * 60 * 24);
    return diff > 7 ? "Add fine" : "No fine";
  };

  const generatePDF = (data, title) => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text(title, 15, 15);
    autoTable(doc, {
      startY: 25,
      head: [['ISBN', 'Title', 'Category', 'Borrower', 'Borrow Date']],
      body: data.map(b => [b.isbn, b.bookName, b.category, b.borrowerName, validateDateString(b.borrowDate)]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    return doc;
  };

  const generateReturnedPDF = (data, title) => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text(title, 15, 15);
    autoTable(doc, {
      startY: 25,
      head: [['ISBN', 'Title', 'Borrower', 'Borrow Date', 'Return Date', 'Fine Status']],
      body: data.map(b => [
        b.isbn, b.bookName, b.borrowerName,
        validateDateString(b.borrowDate),
        validateDateString(b.returnDate),
        calculateFineStatus(b.borrowDate, b.returnDate)
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    return doc;
  };

  const handleGenerateBorrowedPDF = () => {
    const dataToExport = searchBorrowed ? filteredBorrowedBooks : borrowedBooks;
    generatePDF(dataToExport, 'Borrowed Books Report').save('borrowed-books.pdf');
  };

  const handleGenerateReturnedPDF = () => {
    const dataToExport = searchReturned ? filteredReturnedBooks : returnedBooks;
    generateReturnedPDF(dataToExport, 'Returned Books Report').save('returned-books.pdf');
  };

  const deleteBorrowedBook = idx => {
    const book = borrowedBooks[idx];
    fetch(`http://localhost:5000/api/borrowbooks/${book._id}`, { method: 'DELETE' })
      .then(() => setBorrowedBooks(b => b.filter((_, i) => i !== idx)))
      .catch(err => console.error(err));
  };

  const deleteReturnedBook = idx => {
    const book = returnedBooks[idx];
    fetch(`http://localhost:5000/api/returnbooks/${book._id}`, { method: 'DELETE' })
      .then(() => setReturnedBooks(r => r.filter((_, i) => i !== idx)))
      .catch(err => console.error(err));
  };

  const updateBorrowedBook = idx => navigate("/borrowerupdate", { state: { book: borrowedBooks[idx], index: idx } });
  
  const handleReturnBook = (book) => {
    navigate("/returns", {
      state: {
        borrowerName: book.borrowerName, // Pass only borrower name
        borrowDate: book.borrowDate, // Pass only borrow date
      },
    });
  };
  
  const handleAddFine = book => navigate("/add-fine", { state: { book } });

  const filteredBorrowedBooks = borrowedBooks.filter(b =>
    [b.isbn, b.bookName, b.category, b.borrowerName, b.borrowDate]
      .some(field => field?.toString().toLowerCase().includes(searchBorrowed.toLowerCase()))
  );

  const filteredReturnedBooks = returnedBooks
    .map(b => ({ ...b, fineStatus: calculateFineStatus(b.borrowDate, b.returnDate) }))
    .filter(b =>
      [b.isbn, b.bookName, b.borrowerName, b.borrowDate, b.returnDate, b.fineStatus]
        .some(field => field?.toString().toLowerCase().includes(searchReturned.toLowerCase()))
    );

  const handleDropdownClick = page => {
    setDropdownOpen(false);
    const routes = {
      'Start System': '/transactions',
      'Transactions History': '/dashboard',
      'Manage Books': '/manage-books',
      'User Management': '/user-management',
      'View Site': '/',
      'Log out': '/login'
    };
    navigate(routes[page] || '/transactions');
  };

  return (
    <div className="transactions-container">
      <div className="dashboard-container">
        <button className="dashboard-btn" onClick={() => setDropdownOpen(o => !o)}>Dashboard</button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {['Start System', 'Transactions History', 'Manage Books', 'User Management', 'View Site', 'Log out']
              .map(p => <li key={p} onClick={() => handleDropdownClick(p)}>{p}</li>)}
          </div>
        )}
      </div>

      <h1>Library Transactions</h1>

      <div className="squares-container">
        <div className="square borrowed" onClick={() => navigate("/borrow")}>
          <h2>Borrowed Books</h2><p>{borrowedBooks.length}</p>
        </div>
        <div className="square returned" onClick={() => navigate("/returns")}>
          <h2>Returned Books</h2><p>{returnedBooks.length}</p>
        </div>
      </div>

      <div className="tables-container">
        {/* Borrowed Table */}
        <div className="table-wrapper">
          <h2>Borrowed Books</h2>
          <div className="search-container1">
            <input placeholder="Search…" value={searchBorrowed}
              onChange={e => setSearchBorrowed(e.target.value)} className="search-bar" />
            <button className="pdf-btn" onClick={handleGenerateBorrowedPDF}>Generate PDF</button>
            <button className="analyze-btn" onClick={() => navigate('/banalyze', { state: { borrowedBooks } })}>Analyze</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ISBN</th><th>Title</th><th>Category</th>
                <th>Borrower</th><th>Borrow Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowedBooks.map((b, i) => (
                <tr key={b._id || i}>
                  <td>{b.isbn}</td>
                  <td>{b.bookName}</td>
                  <td>{b.category}</td>
                  <td>{b.borrowerName}</td>
                  <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button className="updated-btn" onClick={() => updateBorrowedBook(i)}>Update</button>
                    <button className="delete-btn" onClick={() => deleteBorrowedBook(i)}>Delete</button>
                    <button className="return-btn" onClick={() => handleReturnBook(b)}>Return</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Returned Table */}
        <div className="table-wrapper">
          <h2>Returned Books</h2>
          <div className="search-container2">
            <input placeholder="Search…" value={searchReturned}
              onChange={e => setSearchReturned(e.target.value)} className="search-bar" />
            <button className="pdf-btn" onClick={handleGenerateReturnedPDF}>Generate PDF</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ISBN</th><th>Title</th><th>Borrower</th>
                <th>Borrow Date</th><th>Return Date</th><th>Fine Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturnedBooks.map((b, i) => (
                <tr key={b._id || i}>
                  <td>{b.isbn}</td>
                  <td>{b.bookName}</td>
                  <td>{b.borrowerName}</td>
                  <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(b.returnDate).toLocaleDateString()}</td>
                  <td>
                    {b.fineStatus === "Add fine"
                      ? <button className="Addfine" onClick={() => handleAddFine(b)}>Add Fine</button>
                      : "No fine"}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteReturnedBook(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;