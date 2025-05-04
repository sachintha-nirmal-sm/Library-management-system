import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import "./i-booklist.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [qrData, setQrData] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    setBooks(storedBooks);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = "Book Haven";
    const dateTime = new Date().toLocaleString();
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${dateTime}`, 14, 30);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 123, 255);

    const headerHeight = 10;
    const cellHeight = 8;
    doc.rect(14, 40, 35, headerHeight, "F");
    doc.rect(49, 40, 50, headerHeight, "F");
    doc.rect(99, 40, 35, headerHeight, "F");
    doc.rect(134, 40, 35, headerHeight, "F");
    doc.rect(169, 40, 35, headerHeight, "F");

    doc.setTextColor(255, 255, 255);
    doc.text("ISBN", 14 + 5, 45);
    doc.text("Book Name", 49 + 5, 45);
    doc.text("Author", 99 + 5, 45);
    doc.text("Category", 134 + 5, 45);
    doc.text("Published Date", 169 + 5, 45);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const rowHeight = 8;

    books.forEach((book, index) => {
      const yPosition = 50 + index * rowHeight;
      doc.text(book.isbn, 14 + 5, yPosition + 5);
      doc.text(book.name, 49 + 5, yPosition + 5);
      doc.text(book.author, 99 + 5, yPosition + 5);
      doc.text(book.category, 134 + 5, yPosition + 5);
      doc.text(book.publishedDate, 169 + 5, yPosition + 5);
      doc.line(14, yPosition + rowHeight, 204, yPosition + rowHeight);
    });

    doc.line(49, 40, 49, 50 + books.length * rowHeight);
    doc.line(99, 40, 99, 50 + books.length * rowHeight);
    doc.line(134, 40, 134, 50 + books.length * rowHeight);
    doc.line(169, 40, 169, 50 + books.length * rowHeight);

    doc.setLineWidth(0.5);
    doc.rect(14, 40, 190, books.length * rowHeight + headerHeight);

    doc.save("BookList.pdf");
  };

  const getCategoryCounts = () => {
    const categoryCounts = {};
    books.forEach((book) => {
      categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
    });
    return categoryCounts;
  };

  const handleDelete = (index) => {
    setShowDeleteConfirm(true);
    setBookToDelete(index);
  };

  const confirmDelete = () => {
    if (bookToDelete !== null) {
      const updatedBooks = books.filter((_, i) => i !== bookToDelete);
      setBooks(updatedBooks);
      localStorage.setItem("books", JSON.stringify(updatedBooks));
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBookToDelete(null);
  };

  const handleGenerateQR = (book) => {
    const bookDetails = `ISBN: ${book.isbn}\nBook Name: ${book.name}\nAuthor: ${book.author}\nCategory: ${book.category}\nPublished Date: ${book.publishedDate}`;
    setQrData(bookDetails);
    setShowQR(true);
  };

  const handleEdit = (book) => {
    navigate("/update-book", { state: { book } });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBooks = books.filter((book) =>
    book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Book List</h2>

      {/* Category Counts in Squares */}
      <div className="row category-count-container">
        {Object.entries(getCategoryCounts()).map(([category, count]) => (
          <div key={category} className="col-md-3 col-sm-6 mb-3">
            <div className="category-box text-center p-3">
              <h5>{category}</h5>
              <p>{count} Books</p>
            </div>
          </div>
        ))}
      </div>

      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ISBN"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <button className="Qbtn-dark-blue mb-3" onClick={generatePDF}>
        Generate PDF
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Category</th>
            <th>Published Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <tr key={index}>
                <td>{book.isbn}</td>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publishedDate}</td>
                <td>
                  <button className="Qbtn-dark-blue btn-sm me-1" onClick={() => handleGenerateQR(book)}>
                    QR Code
                  </button>
                  <button className="Ebtn-light-blue btn-sm me-1" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button className="Dbtn-danger btn-sm" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteConfirm && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="close" onClick={cancelDelete}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>Do you want to delete this book?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQR && qrData && (
        <div className="qr-container">
          <h3>Generated QR Code</h3>
          <QRCodeCanvas value={qrData} size={200} />
          <button className="btn btn-danger btn-sm" onClick={() => setShowQR(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
