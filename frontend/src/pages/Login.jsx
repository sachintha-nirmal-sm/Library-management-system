import React, { useEffect, useRef } from "react"; // Import useRef for the Spline viewer
import SplineBackground from "../components/SplineBackground"; // Import SplineBackground component

import './Login.css'; // Importing the CSS for styling

function Login() {
  const viewerRef = useRef(null); // Create a ref for the Spline viewer

  useEffect(() => {
    // The viewer is now initialized in SplineBackground, so this line is removed.

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return (
    <div className="login-page">
      <SplineBackground /> {/* Add SplineBackground component for the login background animation */}
      <div ref={viewerRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}></div>

      <div className="login-container">
        <h2 style={{ position: "relative", zIndex: 1 }}>Login</h2>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
