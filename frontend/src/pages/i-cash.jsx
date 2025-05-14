import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-cash.css";

const CashPayment = () => {
  const { id, total } = useParams(); // id = ISBN, total = Total Fine
  const [slip, setSlip] = useState(null);
  const [slipName, setSlipName] = useState(""); 
  const navigate = useNavigate();

  const handleSlipUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSlip(file);
      setSlipName(file.name);
    }
  };

  const handleConfirmPayment = () => {
    if (!slip) {
      alert("Please upload the payment slip before confirming.");
      return;
    }

    const paymentData = {
      Status: "Paid",
      paymentMethod: "Cash",
      paymentSlip: slipName,
    };

    // First, find the payment by ISBN
    axios.get("http://localhost:5000/api/payments")
      .then((response) => {
        const paymentToUpdate = response.data.find((p) => p.ISBN === id);
        
        if (!paymentToUpdate) {
          console.error("Payment not found with ISBN:", id);
          alert("Payment not found. Please try again.");
          return;
        }
        
        // Now update using the document's _id
        return axios.put(`http://localhost:5000/api/payments/${paymentToUpdate._id}`, paymentData);
      })
      .then((response) => {
        if (response) { // Check if response exists (might not if payment not found)
          sessionStorage.setItem("paymentSuccessMessage", "Payment marked as Paid ✅");
          navigate("/payment-table");
        }
      })
      .catch((err) => {
        console.error("Payment update failed:", err);
        alert("Failed to confirm payment.");
      });
  };

  return (
    <div className="cash-payment-container">
      <h2>Cash Payment</h2>
      <p><strong>ISBN:</strong> {id}</p>
      <p><strong>Total Fine:</strong> ${total}</p>

      <div className="upload-section">
        <label>Upload Payment Slip:</label>
        <input type="file" onChange={handleSlipUpload} />
        <input type="text" value={slipName} readOnly className="slip-textbox" />
      </div>

      <button className="btn btn-success" onClick={handleConfirmPayment}>
        Confirm Payment
      </button>
    </div>
  );
};

export default CashPayment;
