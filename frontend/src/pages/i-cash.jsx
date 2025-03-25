import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  
    // Set the success message
    sessionStorage.setItem("paymentSuccessMessage", "Payment Successful ✅");
  
    // Redirect to payment table
    navigate("/payment-table");
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
