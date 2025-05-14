import React from 'react';
import { FiUsers, FiBook, FiArchive, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './newdashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const adminFunctions = [
    {
      title: 'User Management',
      description: 'Handle user accounts, permissions, and activities',
      icon: <FiUsers size={40} />,
      path: '/users'
    },
    {
      title: 'Inventory Management',
      description: 'Monitor book inventory, stock levels, and categories',
      icon: <FiArchive size={40} />,
      path: '/inventory'
    },
    {
      title: 'Borrow Management',
      description: 'Track borrowed books, returns, and overdue items',
      icon: <FiClock size={40} />,
      path: '/dashboard'
    },
    {
      title: 'E-Library Management',
      description: 'Manage digital books and online resources',
      icon: <FiBook size={40} />,
      path: '/a-booklist'
    }
  ];

  return (
    <div className="dashboard-container-full">
      {/* Main Content */}
      <div className="main-content-full">
        {/* Header */}
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-text">Welcome, Admin</h1>
            <p className="welcome-subtext">Manage your library system efficiently</p>
          </div>
          <div className="profile-section">
            <span>Admin Name</span>
            <div className="profile-badge">AD</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="dashboard-grid">
            {adminFunctions.map((func, index) => (
              <div 
                key={index} 
                className="function-card"
                onClick={() => navigate(func.path)}
              >
                <div className="function-icon">
                  {func.icon}
                </div>
                <h3 className="function-title">{func.title}</h3>
                <p className="function-description">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;