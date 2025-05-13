import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './UserAnalytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserAnalytics = ({ users }) => {
  // Calculate total membership fees
  const membershipFee = 1000; // Rs. 1000 per user
  const totalFees = users.length * membershipFee;

  // Prepare data for registration progress chart
  const getRegistrationData = () => {
    // Group users by month of registration
    const monthlyData = users.reduce((acc, user) => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'New Registrations',
          data: sortedMonths.map(month => monthlyData[month]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Registration Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="summary-value">{users.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Membership Fees</h3>
          <p className="summary-value">Rs. {totalFees.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Average Monthly Registrations</h3>
          <p className="summary-value">
            {users.length > 0
              ? (users.length / Object.keys(getRegistrationData().labels).length).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      <div className="chart-container">
        <Line data={getRegistrationData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default UserAnalytics; 