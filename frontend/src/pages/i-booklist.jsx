import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Load books from backend
  const loadBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventorys");
      setBooks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Generate PDF of the list
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22).text("Book Haven", 14, 20);
    doc.setFontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // table header
    const cols = ["ISBN", "Book Name", "Author", "Category", "Published Date"];
    const widths = [35, 50, 35, 35, 35];
    let x = 14;
    cols.forEach((h, i) => {
      doc.setFont("helvetica", "bold")
         .setTextColor(255, 255, 255)
         .setFillColor(0, 123, 255)
         .rect(x, 40, widths[i], 10, "F");
      doc.text(h, x + 5, 48);
      x += widths[i];
    });

    // data rows
    doc.setFont("helvetica", "normal").setTextColor(0);
    books.forEach((b, idx) => {
      const y = 50 + idx * 8;
      let cx = 14;
      [b.ISBN, b.BookName, b.Author, b.Category, b.PublishedDate].forEach((val, j) => {
        doc.text(String(val || ""), cx + 5, y + 5);
        cx += widths[j];
      });
    });

    doc.save("BookList.pdf");
  };

  // Category counts
  const getCategoryCounts = () =>
    books.reduce((acc, b) => {
      const cat = b.Category || "Unknown";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  // Delete flow
  const handleDelete = (book) => {
    setShowDeleteConfirm(true);
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/inventorys/${bookToDelete._id}`);
      setShowDeleteConfirm(false);
      setBookToDelete(null);
      loadBooks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBookToDelete(null);
  };

  // QR code
  const handleGenerateQR = (b) => {
    setQrData(
      `ISBN: ${b.ISBN}\nBook Name: ${b.BookName}\nAuthor: ${b.Author}\nCategory: ${b.Category}\nPublished Date: ${b.PublishedDate}`
    );
    setShowQR(true);
  };

  // Edit navigation
  const handleEdit = (b) => {
    navigate("/update-book", { state: { book: b } });
  };

  // Filter by ISBN
  const filteredBooks = books.filter((b) =>
    (b.ISBN || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Book List</h2>

      {/* Category counts */}
      <div className="row category-count-container mb-3">
        {Object.entries(getCategoryCounts()).map(([cat, cnt]) => (
          <div key={cat} className="col-md-3 col-sm-6 mb-3">
            <div className="category-box text-center p-3">
              <h5>{cat}</h5>
              <p>{cnt} Books</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & PDF */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by ISBN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="Qbtn-dark-blue" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>

      {/* Book table */}
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
            filteredBooks.map((b) => (
              <tr key={b._id}>
                <td>{b.ISBN || ""}</td>
                <td>{b.BookName || ""}</td>
                <td>{b.Author || ""}</td>
                <td>{b.Category || ""}</td>
                <td>{b.PublishedDate || ""}</td>
                <td>
                  <button
                    className="Qbtn-dark-blue btn-sm me-1"
                    onClick={() => handleGenerateQR(b)}
                  >
                    QR Code
                  </button>
                  <button
                    className="Ebtn-light-blue btn-sm me-1"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="Dbtn-danger btn-sm"
                    onClick={() => handleDelete(b)}
                  >
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

      {/* Delete confirmation */}
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

      {/* QR code display */}
      {showQR && (
        <div className="qr-container">
          <h3>Generated QR Code</h3>
          <QRCodeCanvas value={qrData} size={200} />
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => setShowQR(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
