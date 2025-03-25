import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Added state for email
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", { name, email, phone, address, paymentMethod });
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h2>Sign-Up</h2>
      <p>Membership fee for 1Y plan: 1000 LKR</p>

      {/* Profile Photo Upload */}
      <div className="profile-section">
        <label className="profile-photo">
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" />
          ) : (
            <div className="placeholder">Upload Photo</div>
          )}
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Input Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => handlePaymentMethodChange("cash")}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => handlePaymentMethodChange("card")}
            />
            Card
          </label>
        </div>

        {/* Card Payment Section */}
        {paymentMethod === "card" && (
          <div className="card-details">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVN</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
            <button type="button" className="otp-button">
              Send OTP via phone
            </button>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Cash Payment Section */}
        {paymentMethod === "cash" && (
          <div className="upload-slip">
            <label htmlFor="slip">Upload Your Slip Here</label>
            <input type="file" id="slip" accept="image/*" required />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="confirm-button">
          CONFIRMED
        </button>
      </form>
    </div>
  );
};

export default Signup;
