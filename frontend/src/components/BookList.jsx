import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaDownload, FaChartBar, FaFileDownload } from 'react-icons/fa';
import BookAnalytics from './BookAnalytics';
import './BookList.css';

// Base64 encoded default cover image (a simple gray rectangle with a book icon)
const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gQ292ZXI8L3RleHQ+PC9zdmc+';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Predefined categories - must match BookForm categories
  const categories = [
    'Novel',
    'Horror',
    'Adventure',
    'Mystery & Thriller',
    'Romance',
    'Fantasy',
    'Education'
  ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/books');
      setBooks(response.data);
      setFilteredBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error loading books. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book => {
      // Apply category filter
      if (selectedCategory !== 'all' && book.category !== selectedCategory) {
        return false;
      }

      // Apply search filter
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase().trim();
      const searchFields = [
        book.title,
        book.author,
        book.category,
        book.isbn,
        book.description
      ];

      return searchFields.some(field => 
        (field?.toLowerCase() || '').includes(searchLower)
      );
    });
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, books]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'publishedYear') {
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (isbn) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axiosInstance.delete(`/api/books/${isbn}`);
        // Refresh the book list after successful deletion
        fetchBooks();
      } catch (err) {
        setError('Error deleting book. Please try again.');
      }
    }
  };

  const handleEdit = (isbn) => {
    navigate(`/a-updatebook/${isbn}`);
  };

  const getCategoryCounts = () => {
    const categoryCounts = {};
    books.forEach(book => {
      const category = book.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    return categoryCounts;
  };

  const getBookCover = (book) => {
    if (book.coverImage) {
      return book.coverImage; // Cloudinary URL is already stored in coverImage
    }
    return DEFAULT_COVER; // Use data URL default cover
  };

  const handleDownloadPDF = async (book) => {
    try {
      if (!book.pdfFile) {
        alert('No PDF file available for this book.');
        return;
      }

      // Show loading state
      const downloadButton = document.querySelector(`[data-book-id="${book.isbn}"]`);
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = '<span class="bl-download-spinner"></span> Downloading...';
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = book.pdfFile;
      link.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset button state after a short delay
      setTimeout(() => {
        if (downloadButton) {
          downloadButton.disabled = false;
          downloadButton.innerHTML = '<FaDownload /> Download PDF';
        }
      }, 2000);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  const handleDownloadAllBooks = async () => {
    try {
      // Show loading state
      const downloadButton = document.querySelector('.bl-download-all-button');
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = '<span class="bl-download-spinner"></span> Generating PDF...';
      }

      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Library Book Collection', 105, 20, { align: 'center' });

      // Add subtitle with date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Generated on ${currentDate}`, 105, 30, { align: 'center' });

      // Add summary
      doc.setFontSize(12);
      doc.text(`Total Books: ${books.length}`, 20, 45);
      doc.text(`Categories: ${new Set(books.map(book => book.category)).size}`, 20, 52);

      // Prepare table data
      const tableData = books.map(book => [
        book.title,
        book.author,
        book.category || 'Uncategorized',
        book.publishedYear,
        book.rating ? `${book.rating}/5` : 'Not Rated',
        book.isbn
      ]);

      // Add table
      autoTable(doc, {
        startY: 60,
        head: [['Title', 'Author', 'Category', 'Year', 'Rating', 'ISBN']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [26, 115, 232],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 50 }, // Title
          1: { cellWidth: 40 }, // Author
          2: { cellWidth: 30 }, // Category
          3: { cellWidth: 20 }, // Year
          4: { cellWidth: 20 }, // Rating
          5: { cellWidth: 30 }, // ISBN
        },
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save('library_book_collection.pdf');

      // Reset button state after a short delay
      setTimeout(() => {
        if (downloadButton) {
          downloadButton.disabled = false;
          downloadButton.innerHTML = '<FaFileDownload /> Download Book List';
        }
      }, 2000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bl-loading-container">
        <div className="bl-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bl-error-container">
        {error}
      </div>
    );
  }

  return (
    <div className="bl-book-list-container">
      <div className="bl-book-list-header">
        <h2>Book List</h2>
        <div className="bl-header-actions">
          <div className="bl-filters">
            <div className="bl-search-box">
              <input
                type="text"
                className="bl-search-input"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="bl-search-icon">🔍</span>
              {searchTerm && (
                <button
                  className="bl-clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
            <div className="bl-category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bl-category-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bl-header-buttons">
            <button 
              className="bl-download-all-button"
              onClick={handleDownloadAllBooks}
              title="Download complete list of all books as PDF"
            >
              <FaFileDownload /> Download Book List
            </button>
            <button 
              className="bl-analytics-button"
              onClick={() => setShowAnalytics(true)}
            >
              <FaChartBar /> View Analytics
            </button>
            <button 
              className="bl-add-book-button"
              onClick={() => navigate('/a-bookform')}
            >
              Add New Book
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="bl-analytics-modal">
          <div className="bl-analytics-modal-content">
            <button 
              className="bl-analytics-close"
              onClick={() => setShowAnalytics(false)}
            >
              ×
            </button>
            <BookAnalytics books={books} />
          </div>
        </div>
      )}

      {(searchTerm || selectedCategory !== 'all') && (
        <div className="bl-filter-info">
          <p>
            Showing {filteredBooks.length} results
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
          <button
            className="bl-clear-filters"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="bl-category-summary">
        <h3>Books by Category</h3>
        <div className="bl-category-grid">
          {Object.entries(getCategoryCounts()).map(([category, count]) => (
            <div 
              key={category} 
              className={`bl-category-card ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="bl-category-icon">📚</div>
              <div className="bl-category-info">
                <span className="bl-category-name">{category}</span>
                <span className="bl-category-count">{count} {count === 1 ? 'Book' : 'Books'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bl-table-container">
        <table className="bl-book-table">
          <thead>
            <tr>
              <th
                className={`sortable ${sortConfig.key === 'title' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('title')}
              >
                Title
              </th>
              <th
                className={`sortable ${sortConfig.key === 'author' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('author')}
              >
                Author
              </th>
              <th
                className={`sortable ${sortConfig.key === 'category' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('category')}
              >
                Category
              </th>
              <th
                className={`sortable ${sortConfig.key === 'publishedYear' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('publishedYear')}
              >
                Published Year
              </th>
              <th
                className={`sortable ${sortConfig.key === 'rating' ? sortConfig.direction : ''}`}
                onClick={() => handleSort('rating')}
              >
                Rating
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.isbn}>
                <td>
                  <div className="bl-book-title-cell">
                    <div className="bl-book-cover-container">
                      <img 
                        src={getBookCover(book)} 
                        alt={`${book.title} cover`} 
                        className="bl-book-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_COVER;
                        }}
                      />
                    </div>
                    <span className="bl-book-title">{book.title}</span>
                  </div>
                </td>
                <td>{book.author}</td>
                <td>
                  <span className="bl-category-badge">{book.category || 'Uncategorized'}</span>
                </td>
                <td>{book.publishedYear}</td>
                <td>
                  <div className="bl-rating-cell">
                    {book.rating ? `${book.rating} / 5` : 'Not Rated'}
                  </div>
                </td>
                <td>
                  <div className="bl-action-buttons">
                    <button
                      className="bl-edit-button"
                      onClick={() => handleEdit(book.isbn)}
                    >
                      Edit
                    </button>
                    <button
                      className="bl-delete-button"
                      onClick={() => handleDelete(book.isbn)}
                    >
                      Delete
                    </button>
                    <button
                      className="bl-download-button"
                      onClick={() => handleDownloadPDF(book)}
                      data-book-id={book.isbn}
                      title="Download PDF version of this book"
                    >
                      <FaDownload /> Download PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bl-pagination">
          <button
            className="bl-page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`bl-page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="bl-page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {filteredBooks.length === 0 && (
        <div className="bl-no-results">
          <p>No books found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
