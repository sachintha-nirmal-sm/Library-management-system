import React, { useState } from 'react';
import './MoodBasedBookRecommendation.css';

const MoodBasedBookRecommendation = () => {
  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detectedMoods, setDetectedMoods] = useState([]);

  // Sample book database
  const booksDb = [
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/api/placeholder/200/300",
      moodTags: ["inspirational", "thoughtful", "spiritual"],
      themes: ["journey", "destiny", "wisdom"],
      tone: "hopeful"
    },
    {
      id: 2,
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      cover: "/api/placeholder/200/300",
      moodTags: ["adventurous", "magical", "escapist"],
      themes: ["friendship", "courage", "coming-of-age"],
      tone: "exciting"
    },
    {
      id: 3,
      title: "The Road",
      author: "Cormac McCarthy",
      cover: "/api/placeholder/200/300",
      moodTags: ["somber", "reflective", "intense"],
      themes: ["survival", "father-son relationship", "apocalypse"],
      tone: "dark"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/api/placeholder/200/300",
      moodTags: ["romantic", "witty", "social"],
      themes: ["love", "class", "reputation"],
      tone: "amusing"
    },
    {
      id: 5,
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      cover: "/api/placeholder/200/300",
      moodTags: ["humorous", "absurd", "escapist"],
      themes: ["adventure", "satire", "space travel"],
      tone: "comedic"
    },
    {
      id: 6,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      cover: "/api/placeholder/200/300",
      moodTags: ["thoughtful", "serious", "emotional"],
      themes: ["justice", "racial inequality", "morality"],
      tone: "reflective"
    },
    {
      id: 7,
      title: "The Da Vinci Code",
      author: "Dan Brown",
      cover: "/api/placeholder/200/300",
      moodTags: ["thrilling", "mysterious", "fast-paced"],
      themes: ["conspiracy", "religion", "art"],
      tone: "suspenseful"
    },
    {
      id: 8,
      title: "Eat, Pray, Love",
      author: "Elizabeth Gilbert",
      cover: "/api/placeholder/200/300",
      moodTags: ["inspirational", "uplifting", "introspective"],
      themes: ["self-discovery", "travel", "healing"],
      tone: "reflective"
    }
  ];

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

  // Handle answer selection
  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
    
    // Move to next question or process results
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      processAnswers();
    }
  };

  // Process answers to determine mood
  const processAnswers = () => {
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const moodScores = {
        happy: 0, 
        sad: 0, 
        reflective: 0, 
        excited: 0, 
        relaxed: 0, 
        tense: 0, 
        escapist: 0, 
        intellectual: 0
      };
      
      // Question 1: Preference
      if (answers.preference === "1") {
        moodScores.happy += 2;
        moodScores.relaxed += 1;
        moodScores.escapist += 1;
      } else if (answers.preference === "2") {
        moodScores.reflective += 2;
        moodScores.intellectual += 2;
      } else if (answers.preference === "3") {
        moodScores.excited += 2;
        moodScores.tense += 1;
      } else if (answers.preference === "4") {
        moodScores.relaxed += 2;
        moodScores.sad += 1;
      }
      
      // Question 2: Day
      if (answers.day === "1") {
        moodScores.tense += 2;
        moodScores.relaxed -= 1;
      } else if (answers.day === "2") {
        moodScores.relaxed += 1;
        moodScores.happy += 1;
      } else if (answers.day === "3") {
        moodScores.escapist += 2;
        moodScores.excited += 1;
      } else if (answers.day === "4") {
        moodScores.sad += 1;
        moodScores.escapist += 1;
      }
      
      // Question 3: Weather
      if (answers.weather === "1") {
        moodScores.happy += 1;
        moodScores.excited += 1;
      } else if (answers.weather === "2") {
        moodScores.reflective += 1;
        moodScores.relaxed += 1;
      } else if (answers.weather === "3") {
        moodScores.sad += 1;
        moodScores.reflective += 1;
      } else if (answers.weather === "4") {
        moodScores.relaxed += 1;
        moodScores.happy += 1;
      }
      
      // Question 4: Activity
      if (answers.activity === "1") {
        moodScores.excited += 2;
        moodScores.escapist += 1;
      } else if (answers.activity === "2") {
        moodScores.relaxed += 2;
        moodScores.reflective += 1;
      } else if (answers.activity === "3") {
        moodScores.intellectual += 2;
        moodScores.reflective += 1;
      } else if (answers.activity === "4") {
        moodScores.happy += 2;
        moodScores.excited += 1;
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
      setCurrentStep(currentStep + 1); // Move to results page
    }, 1500);
  };

  // Get book recommendations based on detected moods
  const getRecommendedBooks = (moods) => {
    // Mood mapping to book tags
    const moodMapping = {
      happy: ["uplifting", "humorous", "inspirational", "witty"],
      sad: ["emotional", "somber", "thoughtful", "introspective"],
      reflective: ["thoughtful", "introspective", "spiritual", "emotional"],
      excited: ["adventurous", "thrilling", "fast-paced", "magical"],
      relaxed: ["soothing", "romantic", "uplifting", "witty"],
      tense: ["thrilling", "mysterious", "intense", "suspenseful"],
      escapist: ["magical", "adventurous", "absurd", "escapist"],
      intellectual: ["thoughtful", "serious", "reflective", "philosophical"]
    };
    
    // Gather relevant mood tags
    const relevantTags = moods.flatMap(mood => moodMapping[mood] || []);
    
    // Find books matching the tags
    const matchingBooks = booksDb.filter(book => 
      book.moodTags.some(tag => relevantTags.includes(tag))
    );
    
    // Return up to 3 books, randomly selected if we have more than 3 matches
    return matchingBooks.length <= 3 
      ? matchingBooks 
      : matchingBooks.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  // Restart the process
  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
    setDetectedMoods([]);
  };

  // Render the current step
  const renderStep = () => {
    // Welcome screen
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
    
    // Questions
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
    
    // Loading screen
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Finding the perfect books for you...</p>
        </div>
      );
    }
    
    // Results screen
    return (
      <div className="results-container">
        <h2>Your Personalized Recommendations</h2>
        
        {detectedMoods.length > 0 && (
          <p className="mood-description">Based on your responses, we think you might enjoy something that's: 
            <span className="mood-highlight"> {detectedMoods.join(' and ')}</span>
          </p>
        )}
        
        {recommendations.length > 0 ? (
          <div className="book-grid">
            {recommendations.map(book => (
              <div key={book.id} className="book-card">
                <img 
                  src={book.cover} 
                  alt={`Cover of ${book.title}`} 
                  className="book-cover"
                />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-themes">
                    <span className="info-label">Themes:</span> {book.themes.join(', ')}
                  </p>
                  <p className="book-tone">
                    <span className="info-label">Tone:</span> {book.tone}
                  </p>
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