import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [otp, setOtp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/750})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!address.trim()) newErrors.address = "Address is required";

    if (paymentMethod === "card") {
      if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      if (!cvv.trim()) newErrors.cvv = "CVV is required";
      if (!otp.trim()) newErrors.otp = "OTP is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const userData = {
          username,
          name,
          email,
          password,
          phone,
          address,
          paymentMethod,
          cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
          cvv: paymentMethod === 'card' ? cvv : undefined,
          profilePhoto
        };

        const response = await axios.post('http://localhost:5001/api/users/register', userData);

        if (response.data) {
          setShowSuccess(true);
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
          }));
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        // Show more specific error messages
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else if (error.response?.status === 400) {
          alert('Invalid data. Please check your inputs.');
        } else if (error.response?.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign-Up</h2>
      <p className="membership-text">Membership fee for 1Y plan: 1000 LKR</p>

      <div className="profile-section">
        <label className="profile-photo">
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" />
          ) : (
            <div className="placeholder">
              <FiUpload className="upload-icon" />
              Upload Photo
            </div>
          )}
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.username ? 'error' : ''}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a unique username"
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className={`form-group ${errors.name ? 'error' : ''}`}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className={`form-group ${errors.email ? 'error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className={`form-group ${errors.password ? 'error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className={`form-group ${errors.address ? 'error' : ''}`}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span className="payment-label">Cash</span>
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <span className="payment-label">Card</span>
          </label>
        </div>

        {paymentMethod === "card" && (
          <div className="card-details">
            <div className={`form-group ${errors.cardNumber ? 'error' : ''}`}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>
            <div className={`form-group ${errors.cvv ? 'error' : ''}`}>
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength="3"
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
            <button type="button" className="otp-button">
              Send OTP via phone
            </button>
            <div className={`form-group ${errors.otp ? 'error' : ''}`}>
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
              {errors.otp && <span className="error-message">{errors.otp}</span>}
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="upload-slip">
            <label htmlFor="slip">Upload Your Payment Slip Here</label>
            <input 
              type="file" 
              id="slip" 
              accept="image/*,.pdf" 
              required 
            />
            <p className="file-hint">(JPEG, PNG or PDF, max 5MB)</p>
          </div>
        )}

        <button type="submit" className="confirm-button">
          CONFIRM
        </button>
      </form>

      {showSuccess && (
        <div className="popup">
          <div className="popup-content">
            <FiCheckCircle className="success-icon" />
            <p>Registration Successful!</p>
            <p>Redirecting to homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;