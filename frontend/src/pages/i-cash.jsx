import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-cash.css";

const CashPayment = () => {
  const { id, total } = useParams(); // id = ISBN, total = Total Fine
  const [slip, setSlip] = useState(null);
  const [slipName, setSlipName] = useState(""); // Store slip filename
  const [paymentStatus, setPaymentStatus] = useState(""); // Store payment status
  const navigate = useNavigate();

  // Handle slip file upload
  const handleSlipUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSlip(file);
      setSlipName(file.name); // Display filename in textbox
    }
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (!slip) {
      alert("Please upload the payment slip before confirming.");
      return;
    }

    // Prepare payment data for the update
    const paymentData = {
      status: "Paid",
      paymentSlip: slipName, // You can later save the file on your server or use a file upload service
    };

    // Update payment status to "Paid" in the backend
    axios.put(`http://localhost:5000/api/payments/${id}`, paymentData)
      .then(() => {
        setPaymentStatus("Payment Successful ✅");
        // Redirect to payment table with a success message
        sessionStorage.setItem("paymentSuccessMessage", "Payment Successful ✅");
        navigate("/payment-table");
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

      {/* Upload Payment Slip */}
      <div className="upload-section">
        <label>Upload Payment Slip:</label>
        <input type="file" onChange={handleSlipUpload} />
        <input type="text" value={slipName} readOnly className="slip-textbox" />
      </div>

      {/* Success Message */}
      {paymentStatus && <p className="success-message">{paymentStatus}</p>}

      {/* Confirm Payment Button */}
      <button className="btn btn-success" onClick={handleConfirmPayment}>
        Confirm Payment
      </button>
    </div>
  );
};

export default CashPayment;
