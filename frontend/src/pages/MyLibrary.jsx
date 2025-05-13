import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const MyLibrary = ({ userId }) => {
  const [libraryData, setLibraryData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await axios.get(`/api/mylibrary/${userId}`);
        setLibraryData(response.data);

        const completed = response.data.filter((book) => book.status === 'Completed').length;
        const reading = response.data.filter((book) => book.status === 'Reading').length;

        setChartData([
          { name: 'Completed', value: completed },
          { name: 'Reading', value: reading },
        ]);
      } catch (error) {
        console.error('Error fetching library data:', error);
      }
    };

    fetchLibraryData();
  }, [userId]);

  return (
    <div>
      <h1>My Library</h1>
      <div>
        <h2>Books I’m Currently Reading</h2>
        <ul>
          {libraryData
            .filter((book) => book.status === 'Reading')
            .map((book) => (
              <li key={book.bookId}>{book.title}</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Books I’ve Finished</h2>
        <ul>
          {libraryData
            .filter((book) => book.status === 'Completed')
            .map((book) => (
              <li key={book.bookId}>{book.title}</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Reading Progress</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default MyLibrary;