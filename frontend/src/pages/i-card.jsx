import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./i-card.css"; // Import styling

const CardPayment = () => {
  const { isbn, total } = useParams(); // Get ISBN and Total Fine from URL
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (cardNumber.length !== 12|| cvv.length !== 3) {
      alert("Please enter a valid 16-digit Card Number and 3-digit CVV.");
      return;
    }
    alert("OTP has been sent to your registered mobile number.");
  };

  const handleConfirmPayment = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    alert(`Payment successful for ISBN: ${isbn}`);
    navigate("/payment-table"); // Redirect back to Payment Table
  };

  return (
    <div className="card-payment-container">
      <h2>Card Payment</h2>
      <div className="payment-details">
        <p><strong>ISBN:</strong> {isbn}</p>
        <p><strong>Total Fine:</strong> ₹{total}</p>
      </div>

      {/* Card Number Input */}
      <div className="input-section">
        <label>Card Number:</label>
        <input
          type="text"
          maxLength="12"
          placeholder="Enter 12-digit Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      {/* CVV Input */}
      <div className="input-section">
        <label>CVV:</label>
        <input
          type="password"
          maxLength="3"
          placeholder="Enter 3-digit CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      {/* OTP Input */}
      <div className="otp-section">
        <label>Enter OTP:</label>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />
        <button className="btn btn-primary" onClick={handleSendOtp}>
          Send OTP
        </button>
      </div>

      <button className="btn btn-success" onClick={handleConfirmPayment}>
        Confirm Payment
      </button>
    </div>
  );
};

export default CardPayment;
