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

  // Calculate days overdue from two dates
  const calculateOverdueDays = (borrowDate, returnDate) => {
    if (!borrowDate || !returnDate) return 0;
    const diff = new Date(returnDate) - new Date(borrowDate);
    const days = Math.floor(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  // Fine is ₹25 per overdue day
  const calculateFine = (days) => days * 25;

  // Update form state and recalc when dates change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "BorrowDate" || name === "ReturnDate") {
        const days = calculateOverdueDays(
          updated.BorrowDate,
          updated.ReturnDate
        );
        updated.OverdueDays = days;
        updated.TotalFine = calculateFine(days);
      }
      return updated;
    });
  };

  // Submit to backend then navigate
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Payment added successfully!");
        navigate("/payment-table", { state: formData });
      } else {
        alert("Failed to add payment: " + (data.msg || res.statusText));
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
      alert("An error occurred. Check console for details.");
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
              <label>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace("ISBN", "ISBN")
                  .replace("Book Name", "Book Name")}
                :
              </label>
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
          <input
            type="text"
            value={`₹${formData.TotalFine}`}
            readOnly
          />
        </div>

        <button type="submit" className="custom-btn-submit">
          OK
        </button>
      </form>
    </div>
  );
};

export default OverdueForm;
