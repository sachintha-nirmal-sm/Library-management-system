import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Analyze.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analyze = () => {
  const location = useLocation();
  const borrowedBooks = location.state?.borrowedBooks || [];
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    // Process data for category analysis
    const categoryCount = borrowedBooks.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {});

    // Process data for monthly analysis
    const monthlyCount = borrowedBooks.reduce((acc, book) => {
      const month = new Date(book.borrowDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    setCategoryData(categoryCount);
    setMonthlyData(monthlyCount);
  }, [borrowedBooks]);

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Books per Category',
        data: Object.values(categoryData),
        backgroundColor: 'rgba(88, 1, 87, 0.5)',
        borderColor: 'rgb(11, 1, 9)',
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Books Borrowed per Month',
        data: Object.values(monthlyData),
        backgroundColor: 'rgba(2, 58, 89, 0.5)',
        borderColor: 'rgb(7, 7, 7)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Book Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="analyze-container">
      <h1>Book Analysis</h1>
      <div className="charts-container">
        <div className="chart-wrapper">
          <h2>Books by Category</h2>
          <Bar options={options} data={categoryChartData} />
        </div>
        <div className="chart-wrapper">
          <h2>Monthly Number of Books Borrowed</h2>
          <Bar options={options} data={monthlyChartData} />
        </div>
      </div>
    </div>
  );
};

export default Analyze;