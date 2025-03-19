import React from 'react';
import './GetStartedPage.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const GetStartedPage = () => {
    return (
        <div className="get-started-container">
            <h1>Get Started</h1>
            <div className="accent-line"></div>
            <p>Welcome to the Get Started page! Here you can find information to help you begin.</p>
            <button className="cta-button">Get Started Now</button>
           
        </div>
    );
}; 

export default GetStartedPage;
