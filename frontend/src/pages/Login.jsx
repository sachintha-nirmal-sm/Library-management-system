import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return 'Invalid email address';
        }
        return '';
      case 'password':
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return '';
      default:
        return '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    try {
      const response = await userAPI.login({ email, password });
      const { token, role } = response.data;

      // Store token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Navigate to home or admin page based on role
      if (role === 'admin') {
        navigate('/UserAdmin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials');
    }
  };

  // Real-time validation on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ flexGrow: 1 }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={handleInputChange}
              onBlur={() => setErrors(prev => ({
                ...prev,
                email: validateField('email', email)
              }))}
              required 
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={handleInputChange}
              onBlur={() => setErrors(prev => ({
                ...prev,
                password: validateField('password', password)
              }))}
              required 
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={!!errors.email || !!errors.password}
          >
            Login
          </button>
        </form>
        <p className="forgot-password">Forgot password?</p>
        <p className="signup-link" onClick={() => navigate('/signup')}>
          Not a member? Signup now
        </p>
      </div>
    </div>
  );
};

export default Login;