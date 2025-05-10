// EmyLibrary.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './EmyLibrary.css';

const EmyLibrary = () => {
  const [activeTab, setActiveTab] = useState('books');

  // Updated sample data with borrowable books
  const userData = {
    readingProgress: [
      { date: 'Week 1', pages: 40 }, { date: 'Week 2', pages: 90 },
      { date: 'Week 3', pages: 130 }, { date: 'Week 4', pages: 200 }
    ],
    books: {
      downloaded: ['Digital Literacy Guide.pdf', 'React Mastery.epub'],
      purchased: ['Advanced CSS Techniques', 'JavaScript Ecosystem'],
      borrow: [
        'The Great Gatsby', 
        'To Kill a Mockingbird',
        '1984',
        'Pride and Prejudice'
      ]
    }
  };

  return (
    <div className="emy-library-container">
      <h1 className="emy-main-title">My Library</h1>

      {/* Reading Progress Graph */}
      <div className="emy-section-card graph-container">
        <h2 className="emy-section-title">Reading Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData.readingProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pages" stroke="#2A6FDB" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs Navigation */}
      <div className="emy-tabs">
        <button 
          className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          My E-Books
        </button>
        <button 
          className={`tab-button ${activeTab === 'borrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrow')}
        >
          Borrowed Books
        </button>
      </div>

      {/* My Books Content */}
      {activeTab === 'books' && (
        <div className="emy-vertical-layout">
          <div className="emy-section-card">
            <h3 className="emy-subtitle">Downloaded Books</h3>
            <ul className="emy-list">
              {userData.books.downloaded.map((item, index) => (
                <li key={index} className="emy-list-item">
                  📥 {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="emy-section-card">
            <h3 className="emy-subtitle">Purchased Books</h3>
            <ul className="emy-list">
              {userData.books.purchased.map((item, index) => (
                <li key={index} className="emy-list-item">
                  💰 {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Borrow Books Content */}
      {activeTab === 'borrow' && (
        <div className="emy-vertical-layout">
          <div className="emy-section-card">
            <h3 className="emy-subtitle">Borrowed Books</h3>
            <ul className="emy-list">
              {userData.books.borrow.map((item, index) => (
                <li key={index} className="emy-list-item">
                  📖 {item}
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmyLibrary;