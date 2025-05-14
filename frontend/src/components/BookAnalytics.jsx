import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './BookAnalytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const BookAnalytics = ({ books }) => {
  // Calculate rating distribution
  const ratingDistribution = React.useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    books.forEach(book => {
      if (book.rating) {
        const ratingIndex = Math.floor(book.rating) - 1;
        if (ratingIndex >= 0 && ratingIndex < 5) {
          distribution[ratingIndex]++;
        }
      }
    });

    return distribution.map((count, index) => ({
      rating: `${index + 1} Star${index === 0 ? '' : 's'}`,
      count: count
    }));
  }, [books]);

  // Calculate category distribution
  const categoryDistribution = React.useMemo(() => {
    const categories = {};
    books.forEach(book => {
      const category = book.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count
    }));
  }, [books]);

  // Calculate yearly publication distribution
  const yearlyDistribution = React.useMemo(() => {
    const years = {};
    books.forEach(book => {
      if (book.publishedYear) {
        years[book.publishedYear] = (years[book.publishedYear] || 0) + 1;
      }
    });

    return Object.entries(years)
      .map(([year, count]) => ({
        year: parseInt(year),
        count
      }))
      .sort((a, b) => a.year - b.year);
  }, [books]);

  return (
    <div className="ba-container">
      <h2>Book Analytics Dashboard</h2>
      
      <div className="ba-charts-grid">
        {/* Rating Distribution Chart */}
        <div className="ba-chart-card">
          <h3>Rating Distribution</h3>
          <div className="ba-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1a73e8" name="Number of Books" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="ba-chart-card">
          <h3>Category Distribution</h3>
          <div className="ba-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Publication Chart */}
        <div className="ba-chart-card">
          <h3>Publication Year Distribution</h3>
          <div className="ba-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00C49F" name="Books Published" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAnalytics; 