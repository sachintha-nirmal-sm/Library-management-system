import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analyze.css';

const Analyze = () => {
  const location = useLocation();
  const borrowedBooks = location.state?.borrowedBooks || [];
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartsLoaded, setChartsLoaded] = useState(true);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    try {
      // Process data for category analysis
      const categoryCount = borrowedBooks.reduce((acc, book) => {
        const category = book.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Process data for monthly analysis
      const monthlyCount = borrowedBooks.reduce((acc, book) => {
        const date = new Date(book.borrowDate);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for Recharts
      const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));

      const monthlyChartData = Object.entries(monthlyCount).map(([name, value]) => ({
        name,
        books: value
      }));

      setCategoryData(categoryChartData);
      setMonthlyData(monthlyChartData);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setChartsLoaded(false);
    }
  }, [borrowedBooks]);

  return (
    <div className="analyze-container">
      <h1>Book Analysis</h1>
      
      {chartsLoaded ? (
        <div className="charts-container">
          <div className="chart-wrapper">
            <h2>Books by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} books`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No category data available</p>
            )}
          </div>
          
          <div className="chart-wrapper">
            <h2>Monthly Number of Books Borrowed</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="books" fill="#8884d8" name="Books Borrowed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No monthly data available</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="simple-table">
            <h2>Books by Category</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Number of Books</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="simple-table">
            <h2>Monthly Number of Books Borrowed</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Number of Books</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.books}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="notice">
            <p>Charts could not be loaded. Please make sure Recharts is properly installed:</p>
            <code>npm install --save recharts</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;