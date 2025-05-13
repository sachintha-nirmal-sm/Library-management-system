import React, { useState, useEffect } from "react";
import "./UserAccount.css";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

const UserAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data;
      
      setUserId(userData.userId || "");
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAddress(userData.address || "");
      setPaymentMethod(userData.paymentMethod || "cash");
      setCardNumber(userData.cardNumber || "");
      setCvv(userData.cvv || "");
      setProfilePhoto(userData.profilePhoto || "");
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user profile");
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

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
    setIsEditing(true);
  };

  const handleDone = async () => {
    try {
      const userData = {
        name,
        email,
        phone,
        address,
        paymentMethod,
        profilePhoto
      };

      if (paymentMethod === "card") {
        userData.cardNumber = cardNumber;
        userData.cvv = cvv;
      }

      await userAPI.updateProfile(userData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
        <label htmlFor="userId">User ID</label>
        <input
          type="text"
          id="userId"
          value={userId}
          disabled={true}
          className="readonly-field"
        />
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
