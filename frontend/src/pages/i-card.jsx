import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-card.css";

const CardPayment = () => {
  const { isbn, total } = useParams();
  console.log("ISBN:", isbn, "Total:", total);
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardType, setCardType] = useState("VISA");

  useEffect(() => {
    // Debugging: Log the retrieved parameters
    console.log("ISBN:", isbn, "Total:", total);

    // Validate the presence of isbn and total
    if (!isbn || !total) {
      alert("Invalid payment details. Redirecting to the payment table.");
      navigate("/payment-table");
    }
  }, [isbn, total, navigate]);

  const handleConfirmPayment = () => {
    // Validate card details
    if (cardNumber.length !== 12 || cvv.length !== 3) {
      alert("Please enter a valid 12-digit Card Number and 3-digit CVV.");
      return;
    }

    // Validate expiration date
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expireDate)) {
      alert("Please enter a valid expiration date in MM/YY format.");
      return;
    }

    // Prepare payment data
    const paymentData = {
      status: "Paid",
      paymentDate: new Date().toISOString(),
      cardType,
      phoneNumber,
    };

    // Update the payment status in the backend
    axios
      .put(`http://localhost:5000/api/payments/${isbn}`, paymentData)
      .then(() => {
        alert(`Payment successful for ISBN: ${isbn}`);
        sessionStorage.setItem("paymentSuccessMessage", "Paid");
        navigate("/payment-table");
      })
      .catch((err) => {
        console.error("Payment update failed:", err);
        alert("Failed to confirm payment.");
      });
  };

  return (
    <div className="card-payment-container">
      <h2>Card Payment</h2>
      <div className="payment-details">
        <p><strong>ISBN:</strong> {isbn}</p>
        <p><strong>Total Fine:</strong> ₹{total}</p>
      </div>

      {/* Card Type Selection */}
      <div className="input-section">
        <label>Card Type:</label>
        <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
          <option value="VISA">VISA</option>
          <option value="Master Card">Master Card</option>
          <option value="RuPay">RuPay</option>
          <option value="American Express">American Express</option>
        </select>
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

      {/* Expire Date Input */}
      <div className="input-section">
        <label>Expire Date:</label>
        <input
          type="text"
          maxLength="5"
          placeholder="MM/YY"
          value={expireDate}
          onChange={(e) => setExpireDate(e.target.value)}
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

      {/* Confirm Payment Button */}
      <button className="btn btn-success" onClick={handleConfirmPayment}>
        Confirm Payment
      </button>
    </div>
  );
};

export default CardPayment;
