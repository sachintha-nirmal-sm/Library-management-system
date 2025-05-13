import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaBookmark, FaArrowLeft, FaStar, FaEye, FaPlay, FaPause, FaStop, FaDownload } from 'react-icons/fa';
import axiosInstance from '../config/axiosInstance';
import './BookDetails.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Base64 encoded default cover image
const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+';

const BookDetails = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchLaterList, setWatchLaterList] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBookText, setShowBookText] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const paragraphs = book?.bookText ? book.bookText.split('\n') : [];

  // Function to calculate page count
  const calculatePageCount = (text) => {
    if (!text) return 0;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });
    
    doc.setFont('helvetica');
    doc.setFontSize(11);
    
    const paragraphs = text.split('\n');
    let y = 40;
    let pages = 1;
    
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        if (index > 0) {
          y += 5;
        }
        
        const lines = doc.splitTextToSize(paragraph, 170);
        
        if (y + lines.length * 5 > 280) {
          pages++;
          y = 20;
        }
        
        y += lines.length * 5;
      }
    });
    
    return pages;
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/books/${isbn}`);
        setBook(response.data);
        if (response.data.bookText) {
          const pages = calculatePageCount(response.data.bookText);
          setPageCount(pages);
        }
      } catch (err) {
        setError('Error loading book details. Please try again later.');
        console.error('Error fetching book details:', err);
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
        setWatchLaterList([]);
      }
    };

    fetchBookDetails();
    fetchWatchLaterList();
  }, [isbn]);

  const handleWatchLater = async () => {
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

  const handleRating = async (rating) => {
    if (!submitted) {
      try {
        const response = await axiosInstance.put(`/api/books/rate/${book._id}`, {
          rating: rating
        });
        setUserRating(rating);
        setSubmitted(true);
        setBook(prev => ({ ...prev, rating: rating }));
        alert('Rating submitted successfully!');
      } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Failed to submit rating. Please try again.');
      }
    }
  };

  const getBookCover = () => {
    if (book?.coverImage) {
      if (book.coverImage.startsWith('http')) {
        return book.coverImage;
      }
      return `http://localhost:5000/uploads/${book.coverImage}`;
    }
    return DEFAULT_COVER;
  };

  const playBookText = (startIdx = currentParagraph) => {
    if (!paragraphs.length) return;
    synthRef.current.cancel();
    let idx = startIdx;
    setCurrentParagraph(idx);
    setIsPaused(false);
    setIsReading(true);

    const speakNext = () => {
      if (idx >= paragraphs.length) {
        setIsReading(false);
        setIsPaused(false);
        return;
      }
      const utterance = new window.SpeechSynthesisUtterance(paragraphs[idx]);
      utteranceRef.current = utterance;
      utterance.onend = () => {
        idx++;
        setCurrentParagraph(idx);
        if (!synthRef.current.paused && !synthRef.current.speaking) {
          speakNext();
        }
      };
      utterance.onerror = () => {
        setIsReading(false);
        setIsPaused(false);
      };
      synthRef.current.speak(utterance);
    };
    speakNext();
  };

  const pauseReading = () => {
    if (synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsReading(false);
    }
  };

  const stopReading = () => {
    synthRef.current.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  const handleParagraphClick = (idx) => {
    setCurrentParagraph(idx);
    playBookText(idx);
  };

  const toggleBookText = () => {
    setShowBookText((prev) => {
      const newState = !prev;
      if (newState && paragraphs.length) {
        setCurrentParagraph(0);
        playBookText(0);
      } else {
        stopReading();
      }
      return newState;
    });
  };

  const handleDownloadPDF = () => {
    if (!book?.bookText) {
      alert('No book text available for download.');
      return;
    }

    // Create new PDF document with better page size and margins
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    // Set default font
    doc.setFont('helvetica');
    
    // Add book cover image if available
    if (book.coverImage) {
      const img = new Image();
      img.src = getBookCover();
      img.onload = () => {
        // Add cover image with better positioning
        doc.addImage(img, 'JPEG', 20, 20, 170, 120);
        
        // Add book details with better typography
        doc.setFontSize(28);
        doc.setTextColor(42, 42, 114); // Primary color
        doc.text(book.title, 20, 150);
        
        doc.setFontSize(18);
        doc.setTextColor(100, 100, 100);
        doc.text(`by ${book.author}`, 20, 160);
        
        // Add metadata in a clean format - only if values exist
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        const metadata = [];
        
        if (book.genre) {
          metadata.push(`Genre: ${book.genre}`);
        }
        if (book.publishedYear) {
          metadata.push(`Published Year: ${book.publishedYear}`);
        }
        if (book.isbn) {
          metadata.push(`ISBN: ${book.isbn}`);
        }
        
        metadata.forEach((text, index) => {
          doc.text(text, 20, 170 + (index * 7));
        });
        
        // Add description with better formatting
        if (book.description) {
          doc.setFontSize(14);
          doc.setTextColor(42, 42, 114);
          doc.text('Description', 20, 170 + (metadata.length * 7) + 10);
          
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          const splitDesc = doc.splitTextToSize(book.description, 170);
          doc.text(splitDesc, 20, 170 + (metadata.length * 7) + 17);
        }
        
        // Add book text on new page
        doc.addPage();
        
        // Add header with book title
        doc.setFontSize(16);
        doc.setTextColor(42, 42, 114);
        doc.text(book.title, 20, 20);
        
        // Add chapter title
        doc.setFontSize(14);
        doc.text('Book Content', 20, 30);
        
        // Get the text content from the nvl-book-text-content section
        const textContent = document.querySelector('.nvl-book-text-content');
        if (textContent) {
          const paragraphs = Array.from(textContent.querySelectorAll('p')).map(p => p.textContent);
          
          doc.setFontSize(11);
          doc.setTextColor(40, 40, 40);
          let y = 40;
          
          paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim()) {
              // Add paragraph spacing
              if (index > 0) {
                y += 5;
              }
              
              const lines = doc.splitTextToSize(paragraph, 170);
              
              // Check if we need a new page
              if (y + lines.length * 5 > 280) {
                doc.addPage();
                y = 20;
              }
              
              doc.text(lines, 20, y);
              y += lines.length * 5;
            }
          });
        } else {
          // Fallback to book.bookText if the DOM element is not found
          const paragraphs = book.bookText.split('\n');
          let y = 40;
          
          paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim()) {
              // Add paragraph spacing
              if (index > 0) {
                y += 5;
              }
              
              const lines = doc.splitTextToSize(paragraph, 170);
              
              // Check if we need a new page
              if (y + lines.length * 5 > 280) {
                doc.addPage();
                y = 20;
              }
              
              doc.text(lines, 20, y);
              y += lines.length * 5;
            }
          });
        }
        
        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }
        
        // Save the PDF
        doc.save(`${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      };
    } else {
      // If no cover image, start with text content
      doc.setFontSize(28);
      doc.setTextColor(42, 42, 114);
      doc.text(book.title, 20, 30);
      
      doc.setFontSize(18);
      doc.setTextColor(100, 100, 100);
      doc.text(`by ${book.author}`, 20, 40);
      
      // Add metadata - only if values exist
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const metadata = [];
      
      if (book.genre) {
        metadata.push(`Genre: ${book.genre}`);
      }
      if (book.publishedYear) {
        metadata.push(`Published Year: ${book.publishedYear}`);
      }
      if (book.isbn) {
        metadata.push(`ISBN: ${book.isbn}`);
      }
      
      metadata.forEach((text, index) => {
        doc.text(text, 20, 50 + (index * 7));
      });
      
      // Add description if it exists
      if (book.description) {
        doc.setFontSize(14);
        doc.setTextColor(42, 42, 114);
        doc.text('Description', 20, 50 + (metadata.length * 7) + 10);
        
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const splitDesc = doc.splitTextToSize(book.description, 170);
        doc.text(splitDesc, 20, 50 + (metadata.length * 7) + 17);
      }
      
      // Add book text
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(42, 42, 114);
      doc.text(book.title, 20, 20);
      
      doc.setFontSize(14);
      doc.text('Book Content', 20, 30);
      
      // Get the text content from the nvl-book-text-content section
      const textContent = document.querySelector('.nvl-book-text-content');
      if (textContent) {
        const paragraphs = Array.from(textContent.querySelectorAll('p')).map(p => p.textContent);
        
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        let y = 40;
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            // Add paragraph spacing
            if (index > 0) {
              y += 5;
            }
            
            const lines = doc.splitTextToSize(paragraph, 170);
            
            // Check if we need a new page
            if (y + lines.length * 5 > 280) {
              doc.addPage();
              y = 20;
            }
            
            doc.text(lines, 20, y);
            y += lines.length * 5;
          }
        });
      } else {
        // Fallback to book.bookText if the DOM element is not found
        const paragraphs = book.bookText.split('\n');
        let y = 40;
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            // Add paragraph spacing
            if (index > 0) {
              y += 5;
            }
            
            const lines = doc.splitTextToSize(paragraph, 170);
            
            // Check if we need a new page
            if (y + lines.length * 5 > 280) {
              doc.addPage();
              y = 20;
            }
            
            doc.text(lines, 20, y);
            y += lines.length * 5;
          }
        });
      }
      
      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    }
  };

  useEffect(() => {
    return () => {
      synthRef.current.cancel();
    };
  }, []);

  if (loading) {
    return (
      <div className="nvl-loading">
        <div className="nvl-spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nvl-error">
        <p>{error}</p>
        <button className="nvl-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="nvl-error">
        <p>Book not found</p>
        <button className="nvl-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="nvl-book-details-container">
      <button className="nvl-back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="nvl-book-content">
        <div className="nvl-book-cover-section">
          {getBookCover() ? (
            <img 
              src={getBookCover()} 
              alt={book.title}
              className="nvl-book-cover"
              onError={() => setImageError(true)}
            />
          ) : imageError ? (
            <img 
              src={DEFAULT_COVER}
              alt="No Cover"
              className="nvl-book-cover"
            />
          ) : (
            <div className="nvl-no-cover">
              <FaBook />
              <span>{book.title}</span>
            </div>
          )}
        </div>

        <div className="nvl-book-info">
          <h1 className="nvl-book-title">{book.title}</h1>
          <p className="nvl-book-author">by {book.author}</p>
          <p className="nvl-book-genre">{book.genre}</p>
          
          <div className="nvl-book-description">
            <h2>Description</h2>
            <p>{book.description || 'No description available.'}</p>
          </div>

          <div className="nvl-book-meta">
            <div className="nvl-meta-item">
              <span className="nvl-meta-label">Published Year</span>
              <span className="nvl-meta-value">{book.publishedYear || 'N/A'}</span>
            </div>
            <div className="nvl-meta-item">
              <span className="nvl-meta-label">ISBN</span>
              <span className="nvl-meta-value">{book.isbn}</span>
            </div>
            <div className="nvl-meta-item">
              <span className="nvl-meta-label">Availability</span>
              <span className={`nvl-meta-value ${book.available ? 'nvl-available' : 'nvl-unavailable'}`}>
                {book.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            {pageCount > 0 && (
              <div className="nvl-meta-item">
                <span className="nvl-meta-label">Pages</span>
                <span className="nvl-meta-value">{pageCount} pages</span>
              </div>
            )}
          </div>

          <div className="nvl-rating-section">
            <h2>Rating</h2>
            <div className="nvl-rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`nvl-star ${star <= (book.rating || userRating) ? 'active' : ''}`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            <p className="nvl-rating-text">
              {book.rating ? `${book.rating} / 5` : 'Not rated yet'}
            </p>
          </div>

          <div className="nvl-action-buttons">
            <button 
              className={`nvl-action-button nvl-watch-later-button ${
                watchLaterList.some(item => item.bookId === book._id) ? 'active' : ''
              }`}
              onClick={handleWatchLater}
            >
              <FaBookmark />
              {watchLaterList.some(item => item.bookId === book._id) 
                ? 'Remove from Watch Later' 
                : 'Add to Watch Later'}
            </button>
            
            {book.bookText && (
              <button 
                className="nvl-action-button nvl-download-button"
                onClick={handleDownloadPDF}
              >
                <FaDownload /> Download Book
              </button>
            )}
          </div>
        </div>
      </div>

      {book.bookText && (
        <div className="nvl-book-text-section">
          <button 
            className="nvl-action-button nvl-view-button"
            onClick={toggleBookText}
          >
            <FaEye />
            {showBookText ? 'Hide Book' : 'View Book'}
          </button>

          {showBookText && (
            <>
              <div className="nvl-book-text-content">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    onClick={() => handleParagraphClick(index)}
                    className={index === currentParagraph && isReading ? 'nvl-current-line' : ''}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="nvl-reading-controls">
                <button 
                  className="nvl-control-button"
                  data-state="play"
                  onClick={() => playBookText(currentParagraph)}
                  disabled={isReading && !isPaused}
                >
                  <FaPlay /> Play
                </button>
                <button 
                  className="nvl-control-button"
                  data-state="pause"
                  onClick={pauseReading}
                  disabled={!isReading || isPaused}
                >
                  <FaPause /> Pause
                </button>
                <button 
                  className="nvl-control-button"
                  data-state="stop"
                  onClick={stopReading}
                >
                  <FaStop /> Stop
                </button>
              </div>
              
              {isReading && paragraphs.length > 0 && (
                <div className="nvl-reading-progress">
                  Reading line {currentParagraph + 1} of {paragraphs.length}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookDetails;