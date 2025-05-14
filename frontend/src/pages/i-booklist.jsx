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

  // Fetch books from MongoDB
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

  const generatePDF = () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  const title = "NOVELNest - Monthly Book Inventory Report";
  const generatedOn = `Generated on: ${new Date().toLocaleString()}`;
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(generatedOn, 14, 30);

  // Table headers
  const headers = ["ISBN", "Book Name", "Author", "Category", "Published Date"];
  const colWidths = [35, 50, 35, 35, 35];
  const startX = 14;
  let startY = 40;
  const rowHeight = 10;

  // Draw header row
  doc.setFillColor(41, 128, 185); // Dark blue
  doc.setTextColor(255); // White text
  doc.setFont("helvetica", "bold").setFontSize(11);

  let x = startX;
  headers.forEach((header, i) => {
    doc.rect(x, startY, colWidths[i], rowHeight, "F");
    doc.text(header, x + 2, startY + 7);
    x += colWidths[i];
  });

  // Reset for body rows
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.setTextColor(0);
  startY += rowHeight;

  books.forEach((b, idx) => {
    const row = [
      b.ISBN || "",
      b.BookName || "",
      b.Author || "",
      b.Category || "",
      b.PublishedDate || "",
    ];

    // Light gray background for even rows
    if (idx % 2 === 0) {
      doc.setFillColor(245, 245, 245); // light gray
      doc.rect(startX, startY, colWidths.reduce((a, b) => a + b), rowHeight, "F");
    }

    let colX = startX;
    row.forEach((text, colIdx) => {
      doc.text(String(text), colX + 2, startY + 7);
      colX += colWidths[colIdx];
    });

    startY += rowHeight;

    // Pagination if out of space
    if (startY > 280) {
      doc.addPage();
      startY = 20;

      // Redraw headers
      x = startX;
      doc.setFillColor(41, 128, 185);
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold").setFontSize(11);
      headers.forEach((header, i) => {
        doc.rect(x, startY, colWidths[i], rowHeight, "F");
        doc.text(header, x + 2, startY + 7);
        x += colWidths[i];
      });

      doc.setTextColor(0);
      doc.setFont("helvetica", "normal").setFontSize(10);
      startY += rowHeight;
    }
  });

  doc.save("Book_Inventory_Report.pdf");
};


  const getCategoryCounts = () =>
    books.reduce((acc, b) => {
      const cat = b.Category || "Unknown";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  const handleDelete = (b) => {
    setShowDeleteConfirm(true);
    setBookToDelete(b);
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

  const handleGenerateQR = (b) => {
    // Create a JSON object instead of a text string with newlines
    const bookData = JSON.stringify({
      isbn: b.ISBN || "",
      bookName: b.BookName || "",
      author: b.Author || "",
      category: b.Category || "",
      publishedDate: b.PublishedDate || ""
    });
    
    setQrData(bookData);
    setShowQR(true);
  };

  const handleEdit = (b) => {
    navigate("/update-book", { state: { book: b } });
  };

  // **Guard against undefined ISBN**
  const filtered = books.filter((b) =>
    (b.ISBN || "").toLowerCase().includes(searchQuery.toLowerCase())
    || (b.Author || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add a function to navigate to the book form page
  const handleAddBook = () => {
    navigate("/bookform");
  };

  return (
    <div className="container mt-4">
      <h2>Book List</h2>

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

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by ISBN, Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="button-group">
          <button className="Qbtn-dark-blue me-2" onClick={generatePDF}>
            Generate PDF
          </button>
          <button className="Abtn-green" onClick={handleAddBook}>
            Add Book
          </button>
        </div>
      </div>

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
          {filtered.length > 0 ? (
            filtered.map((b) => (
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
                <button className="Pbtn-green" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="Dbtn-danger" onClick={confirmDelete}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQR && (
        <div className="qr-container">
          <h3>Generated QR Code</h3>
          <QRCodeCanvas value={qrData} size={200} />
          <button
            className="Dbtn-danger btn-sm mt-2"
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
