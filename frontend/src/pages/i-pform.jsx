import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./i-pform.css";

const OverdueForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ISBN: "",
    BookName: "",
    BorrowerName: "",
    BorrowDate: "",
    ReturnDate: "",
    OverdueDays: 0,
    TotalFine: 0, // This will hold the total fine calculated value
  });

  // Function to calculate overdue days based on borrow date and return date
  const calculateOverdueDays = (borrowDate, returnDate) => {
    if (!borrowDate || !returnDate) return 0; // If either date is missing, return 0 overdue days
    const borrowDateObj = new Date(borrowDate);
    const returnDateObj = new Date(returnDate);
    const timeDiff = returnDateObj - borrowDateObj;
    const daysOverdue = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysOverdue > 0 ? daysOverdue : 0; // If overdue days is negative, set to 0
  };

  // Function to calculate fine based on overdue days
  const calculateFine = (overdueDays) => overdueDays * 25;

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Recalculate overdue days and total fine when either BorrowDate or ReturnDate changes
      if (name === "BorrowDate" || name === "ReturnDate") {
        const overdueDays = calculateOverdueDays(updatedData.BorrowDate, updatedData.ReturnDate);
        updatedData.OverdueDays = overdueDays;
        updatedData.TotalFine = calculateFine(overdueDays);
      }

      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment-table", { state: formData });
  };

  return (
    <div className="Fcontainer">
      <h2>Overdue Fine Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Render all form fields except for TotalFine */}
        {Object.keys(formData).map((key) => {
          if (key === "TotalFine") return null; // Skip TotalFine from the form
          return (
            <div className="form-group" key={key}>
              <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <input
                type={key.includes("Date") ? "date" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                readOnly={key === "OverdueDays" || key === "TotalFine"}
                required
              />
            </div>
          );
        })}
        {/* Display the calculated fine in the table */}
        <div className="form-group">
          <label>Total Fine:</label>
          <input
            type="text"
            value={`$${formData.TotalFine}`}
            readOnly
          />
        </div>
        <button type="submit" className="custom-btn-submit">OK</button>
      </form>
    </div>
  );
};

export default OverdueForm;
