import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import img1 from "../assets/img/slideshow1.jpeg";
import img2 from "../assets/img/slideshow2.jpg";
import img3 from "../assets/img/slideshow3.jpg";
import img4 from "../assets/img/slideshow4.jpg";
import img5 from "../assets/img/slideshow5.jpeg";
import BookModal from '../components/BookModal'; 
import { FaSearch, FaBookOpen, FaBookReader, FaExclamationCircle, FaBookmark, FaEye, FaBook, FaStar } from 'react-icons/fa';
import SplineBackground from '../components/SplineBackground'; 
import axiosInstance from '../utils/axiosConfig';
import './Home.css';

// Base64 encoded default cover image (a simple gray rectangle with a book icon)
const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+';

const Home = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryCount, setCategoryCount] = useState({});
  const [storedBooks, setStoredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/books');
        const books = response.data;
        
        // Sort books by date (newest first) and get exactly 3 most recent
        const sortedBooks = [...books]
          .sort((a, b) => new Date(b.createdAt || b.addedAt) - new Date(a.createdAt || a.addedAt))
          .slice(0, 3);
        
        setRecentBooks(sortedBooks);

        // Calculate category counts
        const counts = books.reduce((acc, book) => {
          const category = book.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setCategoryCounts(counts);
        setStoredBooks(books);
      } catch (err) {
        setError('Error loading books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchLaterList = async () => {
      try {
        const response = await axiosInstance.get('/api/watch-later');
        setWatchLaterList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching watch later list:', error);
        setWatchLaterList([]); // Ensure it's always an array
      }
    };

    fetchBooks();
    fetchWatchLaterList();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    lazyLoad: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    fade: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          arrows: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          dots: true,
          arrows: false
        }
      }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError("");

    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term");
      setIsSearching(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = storedBooks.filter(book => {
      const title = (book.title || "").toLowerCase();
      const author = (book.author || "").toLowerCase();
      const genre = (book.genre || "").toLowerCase();
      const category = (book.category || "").toLowerCase();
      const description = (book.description || "").toLowerCase();

      return (
        title.includes(query) ||
        author.includes(query) ||
        genre.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  };

  const handleViewDetails = (book) => {
    if (!book) {
      console.error('No book data provided');
      return;
    }
    navigate(`/book/${book.isbn || book._id}`); // Navigate to BookDetails with ISBN or ID
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleWatchLater = async (book) => {
    try {
      const isBookInList = watchLaterList.some(item => item.bookId === book._id);

      if (isBookInList) {
        await axiosInstance.delete(`/api/watch-later/${book._id}`);
        setWatchLaterList(prevList => prevList.filter(item => item.bookId !== book._id));
        alert('Removed from Watch Later');
      } else {
        const response = await axiosInstance.post('/api/watch-later', { bookId: book._id });
        setWatchLaterList(prevList => [...prevList, response.data]);
        alert('Added to Watch Later');
      }
    } catch (error) {
      console.error('Error updating watch later list:', error);
    }
  };

  const handleRatingUpdate = (bookId, rating) => {
    setStoredBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, rating } : book
      )
    );
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

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="nvl-root">
      <div className="nvl-spline-wrapper">
        <SplineBackground />
      </div>

      <nav className="nvl-nav">
        <Link to="/home" className="nvl-nav-logo">NOVELNest</Link>
        <ul className="nvl-nav-links">
          <li><Link to="/mylibrary">My Library</Link></li>
          <li>
            <Link to="/watchlater" className="nvl-watchlist-link">
              <FaBookmark /> Watch Later
              {watchLaterList.length > 0 && (
                <span className="nvl-watchlist-count">{watchLaterList.length}</span>
              )}
            </Link>
          </li>
          <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
        </ul>
      </nav>

      <main className="nvl-main-content">
        <section className="hero">
          <div className="hero-content">
            <h1>NOVELNest</h1>
            <p>Your ultimate digital library for seamless book browsing, borrowing, and reading.</p>
            <div className="stats">
              <div className="stat-item">
                <FaBookOpen className="stat-icon" />
                <span>50k+ eBooks</span>
              </div>
              <div className="stat-item">
                <FaBookReader className="stat-icon" />
                <span>24/7 Access</span>
              </div>
            </div>
          </div>
          
          <div className="nvl-hero-slider">
            <Slider {...settings} className="nvl-slider">
              {[img1, img2, img3, img4, img5].map((img, index) => (
                <div key={index} className="nvl-slide">
                  <div className="nvl-slide-overlay"></div>
                  <img src={img} alt={`Slide ${index + 1}`} className="nvl-slide-image" />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section className="nvl-search-section">
          <div className="nvl-search-container">
            <form onSubmit={handleSearch} className="nvl-search-form">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search books by title, author, genre, or category..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={clearSearch}
                  >
                    ×
                  </button>
                )}
              </div>
              <button 
                type="button"
                className="search-button" 
                disabled={isSearching}
                onClick={handleSearch}
              >
                {isSearching ? (
                  <span className="loading-spinner">Searching...</span>
                ) : (
                  "Search"
                )}
              </button>
            </form>
            {searchError && (
              <div className="search-error">
                <FaExclamationCircle />
                <span>{searchError}</span>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="home-books-grid">
                {searchResults.map((book, index) => (
                  <div key={index} className="home-book-card">
                    <div className="home-book-cover">
                      {book.coverImage ? (
                        <img 
                          src={getBookCover(book)} 
                          alt={book.title} 
                          className="search-book-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_COVER;
                          }}
                        />
                      ) : (
                        <div className="home-no-cover">
                          <FaBookOpen className="default-cover-icon" />
                        </div>
                      )}
                    </div>
                    <div className="home-book-info">
                      <h3>{book.title}</h3>
                      <p className="home-book-author">{book.author}</p>
                      <p className="home-book-category">{book.category || 'Uncategorized'}</p>
                      <div className="home-book-rating">
                        {book.rating ? (
                          <>
                            <span className="home-rating-count">{book.rating}</span>
                            <span className="home-rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  color={i < Math.round(book.rating) ? "#ffd700" : "#e0e0e0"}
                                  style={{ marginLeft: 1, marginRight: 1 }}
                                />
                              ))}
                            </span>
                          </>
                        ) : (
                          <span className="home-rating-count">Not Rated</span>
                        )}
                      </div>
                      <div className="home-book-actions">
                        <button 
                          type="button" 
                          className="home-view-button" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewDetails(book);
                          }}
                        >
                          <FaEye /> View Details
                        </button>
                        <button 
                          type="button"
                          className={`home-watch-later-button ${
                            watchLaterList.some(item => 
                              item.bookId === book._id
                            ) ? 'active' : ''
                          }`}
                          onClick={() => handleWatchLater(book)}
                        >
                          <FaBookmark />
                          {watchLaterList.some(item => 
                            item.bookId === book._id
                          ) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="featured-books">
          <h2 className="section-title">Recently Added Books</h2>
          <div className="home-books-grid">
            {recentBooks.map((book) => (
              <div key={book.isbn} className="home-book-card">
                <div className="home-book-cover">
                  {getBookCover(book) ? (
                    <img 
                      src={getBookCover(book)}
                      alt={book.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = `
                          <div class="home-no-cover">
                            <FaBook />
                            <span>${book.title}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="home-no-cover">
                      <FaBook />
                      <span>{book.title}</span>
                    </div>
                  )}
                </div>
                <div className="home-book-info">
                  <h3>{book.title}</h3>
                  <p className="home-book-author">{book.author}</p>
                  <p className="home-book-category">{book.category || 'Uncategorized'}</p>
                  <div className="home-book-rating">
                    {book.rating ? (
                      <>
                        <span className="home-rating-count">{book.rating}</span>
                        <span className="home-rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              color={i < Math.round(book.rating) ? "#ffd700" : "#e0e0e0"}
                              style={{ marginLeft: 1, marginRight: 1 }}
                            />
                          ))}
                        </span>
                      </>
                    ) : (
                      <span className="home-rating-count">Not Rated</span>
                    )}
                  </div>
                  <div className="home-book-actions">
                    <button 
                      type="button" 
                      className="home-view-button" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewDetails(book);
                      }}
                    >
                      <FaEye /> View Details
                    </button>
                    <button 
                      type="button"
                      className={`home-watch-later-button ${
                        watchLaterList.some(item => 
                          item.bookId === book._id
                        ) ? 'active' : ''
                      }`}
                      onClick={() => handleWatchLater(book)}
                    >
                      <FaBookmark />
                      {watchLaterList.some(item => 
                        item.bookId === book._id
                      ) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="categories-section">
          <h2 className="section-title">Explore by Category</h2>
          <div className="categories-grid">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Link 
                key={category} 
                to={`/category/${category.toLowerCase()}`} 
                className="category-card"
              >
                <div className="category-icon">
                  <FaBookmark />
                </div>
                <div className="category-info">
                  <h3>{category}</h3>
                  <p>{count} {count === 1 ? 'Book' : 'Books'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      
      {isModalOpen && selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBook(null);
          }} 
        />
      )}
    </div>
  );
};

export default Home;
