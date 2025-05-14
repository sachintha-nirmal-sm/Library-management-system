import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';
import './ReturnBooksForm.css';

const ReturnBooksForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Get the book details from location.state if available
  const book = location.state?.book || {};
  // Get borrower details separately if passed
  const { borrowerName, borrowDate } = location.state || {};

  // Initialize state with values from the passed book or empty
  const [bookDetails, setBookDetails] = useState({
    isbn: book.isbn || '',
    bookName: book.bookName || '',
    author: book.author || '',
    category: book.category || '',
    publishedDate: book.publishedDate || ''
  });

  const [borrowerDetails, setBorrowerDetails] = useState({
    name: borrowerName || book.borrowerName || '',
    borrowDate: borrowDate || book.borrowDate
      ? new Date(borrowDate || book.borrowDate).toISOString().split('T')[0]
      : '',
    returnDate: new Date().toISOString().split('T')[0], // Set default return date to today
  });

  // Effect for setting up camera
  useEffect(() => {
    if (showScanner) {
      const codeReader = new BrowserQRCodeReader();

      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          const videoElement = document.getElementById('reader');
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error(err);
          alert('Error accessing camera. Please make sure you have granted camera permissions.');
        });

      return () => {
        const videoElement = document.getElementById('reader');
        if (videoElement && videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [showScanner]);

  // Effect for scanning QR codes
  useEffect(() => {
    if (showScanner) {
      const codeReader = new BrowserQRCodeReader();

      const startScanning = async () => {
        try {
          await codeReader.decodeFromVideoElement('reader', (result, err) => {
            if (result) {
              handleScan(result);
            }
            if (err && !(err instanceof Error)) {
              console.error(err);
            }
          });
        } catch (error) {
          console.error('Error starting scanner:', error);
        }
      };

      startScanning();

      return () => {
        const videoElement = document.getElementById('reader');
        if (videoElement && videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [showScanner]);

  const handleScan = (result) => {
    try {
      const scannedText = result.getText();
      console.log("Scanned QR data:", scannedText);
      
      const scannedData = JSON.parse(scannedText);
      
      // Close scanner after successful scan
      setShowScanner(false);
      
      // Update book details with scanned data
      setBookDetails({
        isbn: scannedData.isbn || bookDetails.isbn,
        bookName: scannedData.bookName || bookDetails.bookName,
        author: scannedData.author || bookDetails.author,
        category: scannedData.category || bookDetails.category,
        publishedDate: scannedData.publishedDate || bookDetails.publishedDate,
      });
      
      alert('Book details scanned and filled successfully!');
    } catch (error) {
      console.error("QR scanning error:", error);
      alert('Invalid QR code format. Please scan a valid book QR code generated from the book list.');
    }
  };

  const handleBookDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleBorrowerDetailsChange = (e) => {
    const { name, value } = e.target;
    setBorrowerDetails({ ...borrowerDetails, [name]: value });
  };

  const isValidPublishedDate = (date) => {
    return new Date(date) <= new Date();
  };

  const isValidReturnDate = (borrowDate, returnDate) => {
    return new Date(returnDate) >= new Date(borrowDate);
  };

  const calculateFine = (borrowDate, returnDate) => {
    const borrow = new Date(borrowDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD - borrow);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const fineRate = 5;
    return diffDays > 14 ? (diffDays - 14) * fineRate : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPublishedDate(bookDetails.publishedDate)) {
      alert('Published Date must be a past date.');
      return;
    }

    if (!isValidReturnDate(borrowerDetails.borrowDate, borrowerDetails.returnDate)) {
      alert('Return Date must be on or after Borrow Date.');
      return;
    }

    const returnedBook = {
      isbn: bookDetails.isbn,
      bookName: bookDetails.bookName,
      author: bookDetails.author, // Ensure author is included
      category: bookDetails.category, // Ensure category is included
      publishedDate: bookDetails.publishedDate, // Ensure publishedDate is included
      borrowerName: borrowerDetails.name,
      borrowDate: borrowerDetails.borrowDate,
      returnDate: borrowerDetails.returnDate,
    };

    try {
      const response = await fetch('http://localhost:5000/api/returnbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnedBook),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to return book: ${error.msg}`);
        return;
      }

      alert('Book returned successfully!');
      navigate('/transactions');

      setBookDetails({
        isbn: '',
        bookName: '',
        author: '',
        category: '',
        publishedDate: '',
      });
      setBorrowerDetails({
        name: '',
        borrowDate: '',
        returnDate: '',
      });
    } catch (error) {
      console.error('Error submitting return:', error);
      alert('An error occurred while returning the book.');
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="return-books-form">
      <h1>Return Books Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Book Details Form */}
          <div className="form-section">
            <h2>Book Details</h2>
            <div className="qr-scanner-container">
              <button
                type="button"
                className="scan-button"
                onClick={() => setShowScanner(!showScanner)}
              >
                {showScanner ? 'Close Scanner' : 'Scan QR Code'}
              </button>
              {showScanner && <video id="reader" className="qr-reader"></video>}
            </div>
            <div className="form-group">
              <label>ISBN:</label>
              <input type="text" name="isbn" value={bookDetails.isbn} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Book Name:</label>
              <input type="text" name="bookName" value={bookDetails.bookName} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Author:</label>
              <input type="text" name="author" value={bookDetails.author} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input type="text" name="category" value={bookDetails.category} onChange={handleBookDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Published Date:</label>
              <input type="date" name="publishedDate" value={bookDetails.publishedDate} onChange={handleBookDetailsChange} required />
            </div>
          </div>

          {/* Borrower Details Form */}
          <div className="form-section">
            <h2>Borrower Details</h2>
            <div className="form-group">
              <label>Name of Borrower:</label>
              <input type="text" name="name" value={borrowerDetails.name} onChange={handleBorrowerDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Borrow Date:</label>
              <input type="date" name="borrowDate" value={borrowerDetails.borrowDate} readOnly />
            </div>
            <div className="form-group">
              <label>Return Date:</label>
              <input type="date" name="returnDate" value={borrowerDetails.returnDate} onChange={handleBorrowerDetailsChange} required />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit">Return</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ReturnBooksForm;