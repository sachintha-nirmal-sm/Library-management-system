import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = () => {
  const [isLibraryManagementOpen, setIsLibraryManagementOpen] = useState(false);

  const toggleLibraryManagement = () => {
    setIsLibraryManagementOpen(!isLibraryManagementOpen);
  };

  return (
    <div className="sidebar">
      <h2>ADMINISTRATOR PAGE</h2>
      <ul>
        <li>
          <a href="#dashboard">Dashboard</a>
          <ul className="nested-list">
            <li>
              <div className="dropdown-header" onClick={toggleLibraryManagement}>
                Library Management
                <span className="dropdown-icon">
                  {isLibraryManagementOpen ? '▲' : '▼'}
                </span>
              </div>
              {isLibraryManagementOpen && (
                <ul className="nested-dropdown-list">
                  <li>
                    <Link to="/transactions">Start System</Link> {/* Link to the Transactions page */}
                  </li>
                  <li><Link to="/dashboard">Transaction History</Link></li> {/* Link to Transaction History */}
                  <li><a href="#manage-book">Manage Books</a></li>
                  <li><a href="#user-management">User Management</a></li>
                </ul>
              )}
              <a href="#Viewsite">View site</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
