import React, { useState } from "react";
import "./UserAccount.css";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState("");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [phone, setPhone] = useState("1234567890");
  const [address, setAddress] = useState("Sample Address");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [cvv, setCvv] = useState("123");
  const [isEditing, setIsEditing] = useState(false);

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

  const handleUpdate = () => {
    console.log("Editing Enabled");
    setIsEditing(true);
  };

  const handleDone = () => {
    console.log("Saved Details:", { name, email, phone, address, paymentMethod });
    setIsEditing(false);
  };

  return (
    <div className="user-account-container">
      <h2>User Account</h2>

      <div className="profile-section">
        <label className="profile-photo">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={!isEditing}
          />
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" />
          ) : (
            <div className="placeholder">Upload Photo</div>
          )}
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      {paymentMethod === "card" && (
        <div className="card-details">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVN</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      )}

      {isEditing ? (
        <button onClick={handleDone} className="done-button">
          Done
        </button>
      ) : (
        <button onClick={handleUpdate} className="update-button">
          Update
        </button>
      )}

      <button onClick={() => navigate("/")} className="ok-button">
        OK
      </button>
    </div>
  );
};

export default UserAccount;
