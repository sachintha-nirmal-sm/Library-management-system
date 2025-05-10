import React, { useState } from "react";
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
    TotalFine: 0,
  });

  const calculateOverdueDays = (borrowDate, returnDate) => {
    if (!borrowDate || !returnDate) return 0;
    const borrowDateObj = new Date(borrowDate);
    const returnDateObj = new Date(returnDate);
    const timeDiff = returnDateObj - borrowDateObj;
    const daysOverdue = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysOverdue > 0 ? daysOverdue : 0;
  };

  const calculateFine = (overdueDays) => overdueDays * 25;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "BorrowDate" || name === "ReturnDate") {
        const overdueDays = calculateOverdueDays(updatedData.BorrowDate, updatedData.ReturnDate);
        updatedData.OverdueDays = overdueDays;
        updatedData.TotalFine = calculateFine(overdueDays);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Payment added successfully!");
        navigate("/payment-table", { state: formData }); // Navigate after successful save
      } else {
        alert("Failed to add payment: " + data.msg);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="Fcontainer">
      <h2>Overdue Fine Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => {
          if (key === "TotalFine") return null;
          return (
            <div className="form-group" key={key}>
              <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <input
                type={key.includes("Date") ? "date" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                readOnly={key === "OverdueDays"}
                required
              />
            </div>
          );
        })}

        <div className="form-group">
          <label>Total Fine:</label>
          <input type="text" value={`$${formData.TotalFine}`} readOnly />
        </div>

        <button type="submit" className="custom-btn-submit">OK</button>
      </form>
    </div>
  );
};

export default OverdueForm;
