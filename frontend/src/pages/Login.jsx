import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ flexGrow: 1 }}>
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="forgot-password">Forgot password?</p>
        <p className="signup-link" onClick={handleSignupClick}>Not a member? Signup now</p>
      </div>

    </div>
  );
};

export default Login;
