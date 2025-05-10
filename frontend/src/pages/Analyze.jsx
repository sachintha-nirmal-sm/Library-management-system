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
  const [titleData, setTitleData] = useState({});

  useEffect(() => {
    // Process data for category analysis
    const categoryCount = borrowedBooks.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {});

    // Process data for title analysis (top 10 most borrowed)
    const titleCount = borrowedBooks.reduce((acc, book) => {
      acc[book.bookName] = (acc[book.bookName] || 0) + 1;
      return acc;
    }, {});

    // Sort titles by count and get top 10
    const sortedTitles = Object.entries(titleCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    setCategoryData(categoryCount);
    setTitleData(sortedTitles);
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

  const titleChartData = {
    labels: Object.keys(titleData),
    datasets: [
      {
        label: 'Number of Times Borrowed',
        data: Object.values(titleData),
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
          <h2>Top 10 Most Borrowed Books</h2>
          <Bar options={options} data={titleChartData} />
        </div>
      </div>
    </div>
  );
};

export default Analyze; 