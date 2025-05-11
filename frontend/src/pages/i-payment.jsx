import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import { jsPDF } from "jspdf";
import "./i-payment.css";

const IPaymentTable = () => {
  const location = useLocation();
  const newPayment = location.state; // The new payment passed via location state
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [selectedISBN, setSelectedISBN] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching and adding payments
  useEffect(() => {
    // Fetch existing payments
    axios.get("http://localhost:5000/api/payments")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Error fetching payments:", err));

    // Add new payment
    if (newPayment) {
      const paymentWithStatus = { ...newPayment, status: "Pending" };
      axios.post("http://localhost:5000/api/payments", paymentWithStatus)
        .then(() => {
          setPayments((prev) => [...prev, paymentWithStatus]);
        })
        .catch((err) => console.error("Error adding new payment:", err));
    }

    const message = sessionStorage.getItem("paymentSuccessMessage");
    if (message) {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.status === "Pending"
            ? { ...payment, status: message }
            : payment
        )
      );
      sessionStorage.removeItem("paymentSuccessMessage"); // Clear message after displaying
    }
  }, [newPayment]);

  const handlePay = (isbn) => {
    setSelectedISBN(isbn === selectedISBN ? null : isbn);
  };

  const handlePaymentMethod = (method, isbn, total) => {
    if (method === "Card") {
      navigate(`/card-payment/${isbn}/${total}`);
    } else if (method === "Cash") {
      navigate(`/cash-payment/${isbn}/${total}`);
    } else {
      alert(`Payment via ${method} initiated for ISBN: ${isbn}`);
    }

    // Update the status to "Paid" once payment is initiated
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.isbn === isbn ? { ...payment, status: "Paid" } : payment
      )
    );
    setSelectedISBN(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = "Book Haven";
    const dateTime = new Date().toLocaleString();
  
    // Set title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 20);
  
    // Set generated date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${dateTime}`, 14, 30);
  
    // Table column headers
    const headers = [
      "ISBN",
      "Book Name",
      "Borrower Name",
      "Borrow Date",
      "Return Date",
      "Overdue Days",
      "Total Fine",
      "Status",
    ];
  
    // Column widths for better space distribution
    const columnWidths = [20, 40, 40, 25, 25, 25, 25, 25]; // Reduced width for each column to fit better
    const headerHeight = 10; // Reduced header height for better fit
    const rowHeight = 8; // Reduced row height
    const tableStartY = 50;
  
    // Set font for table content
    doc.setFont("helvetica", "normal");
  
    // Draw table headers
    let yPosition = tableStartY;
    doc.setFillColor(0, 123, 255); // Header background color (blue)
    doc.setTextColor(255, 255, 255); // White text color for the header
    headers.forEach((header, index) => {
      const x = 14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.rect(x, yPosition, columnWidths[index], headerHeight, "F"); // Fill background color for headers
      doc.text(header, x + columnWidths[index] / 2, yPosition + 6, { align: "center" }); // Centered header text
    });
  
    doc.setTextColor(0, 0, 0); // Set text color to black for table content
  
    // Generate table rows
    yPosition += headerHeight;
    payments.forEach((payment, index) => {
      const row = [
        payment.isbn,
        payment.bookName,
        payment.borrowerName,
        payment.borrowDate,
        payment.returnDate,
        payment.overdueDays,
        payment.totalFine,
      ];
  
      row.forEach((value, colIndex) => {
        const x = 14 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        const cellText = (value ?? "").toString();
        const cellWidth = columnWidths[colIndex];
  
        // Add the text within the cell, wrapping it if necessary
        doc.text(cellText, x + 5, yPosition + 6, { maxWidth: cellWidth - 10 });
      });
  
      // Draw row lines (border for each row)
      doc.setLineWidth(0.5);
      doc.rect(14, yPosition, columnWidths.reduce((a, b) => a + b, 0), rowHeight); // Draw cell border
  
      // Move to next row
      yPosition += rowHeight;
    });
  
    // Add overall table border
    doc.setLineWidth(1);
    doc.rect(14, tableStartY, columnWidths.reduce((a, b) => a + b, 0), yPosition - tableStartY); // Overall table border
  
    // Save the PDF with the table data
    doc.save("payment_table.pdf");
  };

  // Filter payments based on the search term
  const filteredPayments = payments.filter((payment) => {
    return Object.values(payment).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h2>Payment Table</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by ISBN."
          className="search-input"
        />
      </div>

      {/* PDF Button */}
      <button className="btn btn-danger" onClick={generatePDF}>
        Generate PDF
      </button>

      <table className="table">
        <thead>
          <tr>
            {Object.keys(payments[0] || {}).map((key) => {
              if (key !== "status") {
                return (
                  <th key={key}>{key.replace(/([A-Z])/g, " $1").trim()}</th>
                );
              }
              return null;
            })}
            <th>Status</th> {/* Add Status column header */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment, index) => (
            <tr key={index}>
              {Object.entries(payment).map(([key, value], idx) => {
                if (key !== "status") {
                  return <td key={idx}>{value}</td>;
                }
                return null;
              })}
              <td>{payment.status}</td>
              <td>
                <button className="btn btn-success" onClick={() => handlePay(payment.isbn)}>
                  Pay
                </button>
                {selectedISBN === payment.isbn && (
                  <div className="payment-options">
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePaymentMethod("Cash", payment.isbn, payment.totalFine)}
                    >
                      Cash
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handlePaymentMethod("Card", payment.isbn, payment.totalFine)}
                    >
                      Card
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IPaymentTable;