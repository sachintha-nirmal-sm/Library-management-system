import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import { FaArrowLeft, FaBook, FaStar } from 'react-icons/fa';
import './MoodBasedBookRecommendation.css';

// Base64 encoded default cover image
const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+';

const MoodBasedBookRecommendation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedMoods, setDetectedMoods] = useState([]);
  const [books, setBooks] = useState([]);

  // Mood mappings based on categories and genres
  const moodMappings = {
    happy: {
      categories: ['Adventure', 'Romance', 'Fantasy'],
      genres: ['Comedy', 'Adventure', 'Romance'],
      description: 'uplifting and cheerful'
    },
    relaxed: {
      categories: ['Education', 'Novel'],
      genres: ['Educational', 'Literary Fiction'],
      description: 'calm and peaceful'
    },
    excited: {
      categories: ['Adventure', 'Mystery & Thriller'],
      genres: ['Action', 'Thriller', 'Adventure'],
      description: 'thrilling and engaging'
    },
    thoughtful: {
      categories: ['Novel', 'Education'],
      genres: ['Literary Fiction', 'Philosophy', 'History'],
      description: 'deep and thought-provoking'
    },
    scary: {
      categories: ['Horror', 'Mystery & Thriller'],
      genres: ['Horror', 'Thriller', 'Mystery'],
      description: 'intense and suspenseful'
    }
  };

  // Questions for mood assessment
  const questions = [
    {
      id: "preference",
      question: "What would you prefer right now?",
      options: [
        { id: "1", text: "Something light and entertaining" },
        { id: "2", text: "Something deep and thought-provoking" },
        { id: "3", text: "Something thrilling and engaging" },
        { id: "4", text: "Something soothing and comforting" }
      ]
    },
    {
      id: "day",
      question: "How was your day today?",
      options: [
        { id: "1", text: "Busy and hectic" },
        { id: "2", text: "Calm and productive" },
        { id: "3", text: "Boring or routine" },
        { id: "4", text: "Challenging or difficult" }
      ]
    },
    {
      id: "weather",
      question: "What's the weather like today?",
      options: [
        { id: "1", text: "Sunny and bright" },
        { id: "2", text: "Rainy or cloudy" },
        { id: "3", text: "Cold and gloomy" },
        { id: "4", text: "Warm and comfortable" }
      ]
    },
    {
      id: "activity",
      question: "What activity sounds most appealing right now?",
      options: [
        { id: "1", text: "Going on an adventure" },
        { id: "2", text: "Relaxing with a cup of tea" },
        { id: "3", text: "Learning something new" },
        { id: "4", text: "Spending time with friends" }
      ]
    }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/api/books');
        // Ensure books is always an array
        const booksData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data?.data) ? response.data.data : [];
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]); // Set empty array on error
      }
    };
    fetchBooks();
  }, []);

  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      processAnswers();
    }
  };

  const processAnswers = () => {
    setLoading(true);
    
    setTimeout(() => {
      const moodScores = {
        happy: 0,
        relaxed: 0,
        excited: 0,
        thoughtful: 0,
        scary: 0
      };
      
      // Question 1: Preference
      if (answers.preference === "1") {
        moodScores.happy += 2;
        moodScores.relaxed += 1;
      } else if (answers.preference === "2") {
        moodScores.thoughtful += 2;
      } else if (answers.preference === "3") {
        moodScores.excited += 2;
      } else if (answers.preference === "4") {
        moodScores.relaxed += 2;
      }
      
      // Question 2: Day
      if (answers.day === "1") {
        moodScores.excited += 1;
        moodScores.relaxed -= 1;
      } else if (answers.day === "2") {
        moodScores.relaxed += 1;
        moodScores.happy += 1;
      } else if (answers.day === "3") {
        moodScores.excited += 1;
      } else if (answers.day === "4") {
        moodScores.thoughtful += 1;
      }
      
      // Question 3: Weather
      if (answers.weather === "1") {
        moodScores.happy += 1;
        moodScores.excited += 1;
      } else if (answers.weather === "2") {
        moodScores.thoughtful += 1;
        moodScores.relaxed += 1;
      } else if (answers.weather === "3") {
        moodScores.scary += 1;
      } else if (answers.weather === "4") {
        moodScores.relaxed += 1;
        moodScores.happy += 1;
      }
      
      // Question 4: Activity
      if (answers.activity === "1") {
        moodScores.excited += 2;
      } else if (answers.activity === "2") {
        moodScores.relaxed += 2;
      } else if (answers.activity === "3") {
        moodScores.thoughtful += 2;
      } else if (answers.activity === "4") {
        moodScores.happy += 2;
      }
      
      // Determine dominant moods (top 2)
      const sortedMoods = Object.entries(moodScores)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, score]) => score > 0)
        .slice(0, 2)
        .map(([mood]) => mood);
      
      setDetectedMoods(sortedMoods);
      
      // Get book recommendations
      const recommendedBooks = getRecommendedBooks(sortedMoods);
      setRecommendations(recommendedBooks);
      setLoading(false);
      setCurrentStep(currentStep + 1);
    }, 1500);
  };

  const getRecommendedBooks = (moods) => {
    const recommendedBooks = [];
    
    moods.forEach(mood => {
      const mapping = moodMappings[mood];
      if (!mapping) return;

      const matchingBooks = books.filter(book => {
        const categoryMatch = mapping.categories.includes(book.category);
        const genreMatch = mapping.genres.includes(book.genre);
        return categoryMatch || genreMatch;
      });

      // Add up to 2 books per mood
      const selectedBooks = matchingBooks
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      recommendedBooks.push(...selectedBooks);
    });

    // Remove duplicates and limit to 4 books
    return [...new Map(recommendedBooks.map(book => [book.isbn, book])).values()]
      .slice(0, 4);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
    setDetectedMoods([]);
  };

  const getBookCover = (book) => {
    if (book.coverImage) {
      if (book.coverImage.startsWith('data:image') || book.coverImage.startsWith('http')) {
        return book.coverImage;
      }
      if (book.coverImage.startsWith('/uploads/')) {
        return `http://localhost:5000${book.coverImage}`;
      }
      return `http://localhost:5000/uploads/${book.coverImage}`;
    }
    return DEFAULT_COVER;
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="welcome-screen">
          <h2>Find Your Perfect Read</h2>
          <p>Let us help you discover books that match your current mood.</p>
          <p>Answer a few quick questions to get personalized recommendations.</p>
          <button 
            onClick={() => setCurrentStep(1)} 
            className="primary-button"
          >
            Get Started
          </button>
        </div>
      );
    }
    
    if (currentStep >= 1 && currentStep <= questions.length) {
      const currentQuestion = questions[currentStep - 1];
      return (
        <div className="question-container">
          <div className="progress-bar-container">
            <div className="progress-bar">
              {questions.map((_, index) => (
                <div 
                  key={index}
                  className={`progress-segment ${index < currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
            <p className="progress-text">Question {currentStep} of {questions.length}</p>
          </div>
          
          <h3 className="question-text">{currentQuestion.question}</h3>
          
          <div className="options-container">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleAnswer(currentQuestion.id, option.id)}
                className="option-button"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Finding the perfect books for you...</p>
        </div>
      );
    }
    
    return (
      <div className="results-container">
        <h2>Your Personalized Recommendations</h2>
        
        {detectedMoods.length > 0 && (
          <p className="mood-description">
            Based on your responses, we think you might enjoy something that's: 
            <span className="mood-highlight">
              {' '}{detectedMoods.map(mood => moodMappings[mood].description).join(' and ')}
            </span>
          </p>
        )}
        
        {recommendations.length > 0 ? (
          <div className="book-grid">
            {recommendations.map(book => (
              <div key={book.isbn} className="book-card">
                <div className="book-cover">
                  <img 
                    src={getBookCover(book)} 
                    alt={`Cover of ${book.title}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_COVER;
                    }}
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span className="book-category">{book.category}</span>
                    {book.genre && <span className="book-genre">{book.genre}</span>}
                  </div>
                  {book.rating && (
                    <div className="book-rating">
                      <FaStar />
                      <span>{book.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">We couldn't find books that match your mood. Please try again.</p>
        )}
        
        <div className="restart-container">
          <button 
            onClick={handleRestart}
            className="primary-button"
          >
            Get New Recommendations
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mood-reader-container">
      <button 
        className="mood-back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>
      
      <div className="header">
        <h1>Library Mood Reader</h1>
      </div>
      
      <div className="content-area">
        {renderStep()}
      </div>
    </div>
  );
};

export default MoodBasedBookRecommendation;