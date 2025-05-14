import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import "./i-payment.css";

const IPaymentTable = () => {
  const location = useLocation();
  const newPayment = location.state;
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [selectedISBN, setSelectedISBN] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);

  const fetchPayments = () => {
    axios.get("http://localhost:5000/api/payments")
      .then(res => {
        let paymentData = res.data;

        if (newPayment) {
          const isDuplicate = paymentData.some(p => p.ISBN === newPayment.ISBN);
          if (!isDuplicate) {
            const newWithStatus = { ...newPayment, Status: "Pending" };
            axios.post("http://localhost:5000/api/payments", newWithStatus)
              .then(() => {
                setNotification("Payment added successfully!");
                setPayments([...paymentData, newWithStatus]);
              })
              .catch(() => {
                setNotification("Failed to add new payment.");
                setPayments(paymentData);
              });
          } else {
            setPayments(paymentData);
          }
        } else {
          setPayments(paymentData);
        }
      })
      .catch(() => {
        setNotification("Failed to fetch payments.");
      });
  };

  useEffect(() => {
    fetchPayments();

    const message = sessionStorage.getItem("paymentSuccessMessage");
    if (message) {
      setNotification(message);
      sessionStorage.removeItem("paymentSuccessMessage");
    }
    
    // Test the analytics function
    console.log("Testing analytics processing function...");
    try {
      // Create some test payment data
      const testPayments = [
        { ReturnDate: "2023-01-15", TotalFine: 25, Status: "Paid" },
        { ReturnDate: "2023-01-20", TotalFine: 30, Status: "Pending" },
        { ReturnDate: "2023-02-05", TotalFine: 15, Status: "Paid" }
      ];
      
      const result = processMonthlyFines(testPayments);
      console.log("Analytics test result:", result);
      console.log("Analytics test successful");
    } catch (error) {
      console.error("Analytics test failed:", error);
    }
  }, []);

  const handlePay = (isbn) => {
    setSelectedISBN(isbn === selectedISBN ? null : isbn);
  };

  const handlePaymentMethod = (method, isbn, total) => {
    if (method === "Card") {
      navigate(`/card-payment/${isbn}/${total}`);
    } else if (method === "Cash") {
      navigate(`/cash-payment/${isbn}/${total}`);
    }
    setSelectedISBN(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const title = "NOVELNest - Payment Report";
    const dateTime = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 105, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${dateTime}`, 14, 22);

    const headers = [
      "ISBN", "Book Name", "Borrower Name", "Borrow Date",
      "Return Date", "Overdue", "Fine", "Status", "Payment Method"
    ];
    const columnWidths = [17, 26, 26, 21, 21, 13, 13, 15, 22];
    const startX = 10;
    const startY = 28;
    const headerHeight = 7;
    const rowHeight = 7;
    let yPosition = startY;

    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");

    let x = startX;
    headers.forEach((header, i) => {
      doc.rect(x, yPosition, columnWidths[i], headerHeight, "F");
      doc.text(header, x + 1.5, yPosition + 5);
      x += columnWidths[i];
    });

    yPosition += headerHeight;
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");

    payments.forEach((payment, index) => {
      const row = [
        payment.ISBN,
        payment.BookName,
        payment.BorrowerName,
        payment.BorrowDate,
        payment.ReturnDate,
        payment.OverdueDays?.toString(),
        payment.TotalFine?.toString(),
        payment.Status,
        payment.paymentMethod || "-",
      ];

      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(startX, yPosition, columnWidths.reduce((a, b) => a + b, 0), rowHeight, "F");
      }

      let cellX = startX;
      row.forEach((val, colIndex) => {
        doc.text((val ?? "").toString(), cellX + 1.5, yPosition + 5);
        cellX += columnWidths[colIndex];
      });

      yPosition += rowHeight;
      if (yPosition > 280) {
        doc.addPage();
        yPosition = startY;
      }
    });

    doc.save("payment_report.pdf");
  };

  const handleAnalyze = () => {
    try {
      // Process payments to get monthly data
      const monthlyData = processMonthlyFines(payments);
      setAnalyticsData(monthlyData);
      setShowAnalytics(true);
    } catch (error) {
      console.error("Error generating analytics:", error);
      alert("There was an error generating the analytics. Please try again.");
    }
  };

  const processMonthlyFines = (payments) => {
    try {
      // Group fines by month
      const monthlyFines = {};
      
      payments.forEach(payment => {
        if (payment.ReturnDate && payment.TotalFine) {
          // Extract month and year from return date
          let returnDate;
          try {
            returnDate = new Date(payment.ReturnDate);
          } catch (e) {
            // If date parsing fails, skip this payment
            console.warn("Could not parse date:", payment.ReturnDate);
            return;
          }
          
          const monthYear = `${returnDate.getMonth() + 1}/${returnDate.getFullYear()}`;
          
          // Add to monthly totals
          if (!monthlyFines[monthYear]) {
            monthlyFines[monthYear] = {
              month: monthYear,
              totalFine: 0,
              count: 0,
              paid: 0,
              pending: 0
            };
          }
          
          const fine = parseFloat(payment.TotalFine) || 0;
          monthlyFines[monthYear].totalFine += fine;
          monthlyFines[monthYear].count += 1;
          
          // Count paid vs pending
          if (payment.Status === "Paid") {
            monthlyFines[monthYear].paid += 1;
          } else {
            monthlyFines[monthYear].pending += 1;
          }
        }
      });
      
      // Convert to array and sort by month
      return Object.values(monthlyFines).sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        
        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
      });
    } catch (error) {
      console.error("Error processing monthly fines:", error);
      return [];
    }
  };

  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container">
      <h2>Payment Table</h2>

      {notification && <div className="alert alert-success">{notification}</div>}

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by ISBN, Author, etc."
          className="search-input"
        />
      </div>

      <div className="button-group mb-3">
        <button className="btn btn-danger me-2" onClick={generatePDF}>
          Generate PDF
        </button>
        <button className="btn btn-primary" onClick={handleAnalyze}>
          Analyze Fines
        </button>
      </div>

      {showAnalytics && (
        <div className="analytics-modal">
          <div className="analytics-content">
            <div className="analytics-header">
              <h3>Monthly Fine Analysis</h3>
              <button className="close-btn" onClick={() => setShowAnalytics(false)}>×</button>
            </div>
            <div className="analytics-body">
              {analyticsData.length > 0 ? (
                <>
                  <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="totalFine" name="Total Fines" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="analytics-summary">
                    <h4>Summary Statistics</h4>
                    <div className="stats-container">
                      <div className="stat-box">
                        <h5>Total Fines</h5>
                        <p>${payments.reduce((sum, payment) => sum + (parseFloat(payment.TotalFine) || 0), 0).toFixed(2)}</p>
                      </div>
                      <div className="stat-box">
                        <h5>Paid Fines</h5>
                        <p>${payments.filter(p => p.Status === "Paid").reduce((sum, payment) => sum + (parseFloat(payment.TotalFine) || 0), 0).toFixed(2)}</p>
                      </div>
                      <div className="stat-box">
                        <h5>Pending Fines</h5>
                        <p>${payments.filter(p => p.Status !== "Paid").reduce((sum, payment) => sum + (parseFloat(payment.TotalFine) || 0), 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  <p>No fine data available for analysis.</p>
                  <p>Once you have payments with return dates and fines, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Borrower Name</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Overdue Days</th>
            <th>Total Fine</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.ISBN}</td>
              <td>{payment.BookName}</td>
              <td>{payment.BorrowerName}</td>
              <td>{payment.BorrowDate}</td>
              <td>{payment.ReturnDate}</td>
              <td>{payment.OverdueDays}</td>
              <td>{payment.TotalFine}</td>
              <td>{payment.Status}</td>
              <td>{payment.paymentMethod || "-"}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handlePay(payment.ISBN)}
                  disabled={payment.Status === "Paid"}
                >
                  {payment.Status === "Paid" ? "Paid" : "Pay"}
                </button>
                {selectedISBN === payment.ISBN && payment.Status !== "Paid" && (
                  <div className="payment-options mt-2">
                    <button
                      className="btn btn-primary me-1"
                      onClick={() =>
                        handlePaymentMethod("Cash", payment.ISBN, payment.TotalFine)
                      }
                    >
                      Cash
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        handlePaymentMethod("Card", payment.ISBN, payment.TotalFine)
                      }
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
