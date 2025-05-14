import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-card.css"; // Import styling

const CardPayment = () => {
  const { isbn, total } = useParams(); // Get ISBN and Total Fine from URL
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleSendOtp = async () => {
    if (cardNumber.length !== 12 || cvv.length !== 3) {
      alert("Please enter a valid 12-digit Card Number and 3-digit CVV.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/send-otp", {
        phoneNumber,
      });
      setGeneratedOtp(res.data.otp); // Simulated OTP returned by backend
      setOtpSent(true);
      alert("OTP has been sent to your phone (simulated).");
    } catch (err) {
      console.error("OTP send error:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleConfirmPayment = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    if (otp === generatedOtp) {
      alert(`Payment successful for ISBN: ${isbn}`);
      sessionStorage.setItem("paymentSuccessMessage", "Paid");
      navigate("/payment-table"); // Redirect back to Payment Table
    } else {
      alert("Invalid OTP. Please try again.");
    }
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

      {/* Phone Number Input */}
      <div className="input-section">
        <label>Phone Number:</label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      {/* OTP Section */}
      {!otpSent ? (
        <button className="btn btn-primary" onClick={handleSendOtp}>
          Send OTP
        </button>
      ) : (
        <>
          <div className="input-section">
            <label>Enter OTP:</label>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <button className="btn btn-success" onClick={handleConfirmPayment}>
            Confirm Payment
          </button>
        </>
      )}
    </div>
  );
};

export default CardPayment;
