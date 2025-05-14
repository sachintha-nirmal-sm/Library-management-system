import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';
import './UpdateBook.css';

const UpdateBook = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Novel",
    publishedDate: "",
    description: "No description available",
    bookText: "",
    coverImage: null,
    genre: ""
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education"
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/api/books/${isbn}`);
        const bookData = response.data;
        setBook({
          isbn: bookData.isbn,
          title: bookData.title,
          author: bookData.author,
          publishedDate: bookData.publishedYear ? new Date(bookData.publishedYear, 0).toISOString().split('T')[0] : '',
          category: bookData.category || 'Novel',
          description: bookData.description || 'No description available',
          bookText: bookData.bookText || '',
          genre: bookData.genre || '',
          coverImage: null
        });
        setCoverPreview(bookData.coverImage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
        setErrors({ fetch: 'Failed to load book details' });
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [isbn]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value) return 'Title is required';
        if (value.length < 2) return 'Title must be at least 2 characters long';
        if (value.length > 100) return 'Title must not exceed 100 characters';
        if (!/^[a-zA-Z0-9\s.,!?-]+$/.test(value)) return 'Title can only contain letters, numbers, and basic punctuation';
        return '';
      
      case 'author':
        if (!value) return 'Author is required';
        if (value.length < 2) return 'Author name must be at least 2 characters long';
        if (value.length > 50) return 'Author name must not exceed 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Author name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
      
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters long';
        if (value.length > 1000) return 'Description must not exceed 1000 characters';
        return '';
      
      case 'publishedDate':
        if (!value) return 'Published date is required';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Invalid date format';
        if (date > new Date()) return 'Published date cannot be in the future';
        return '';
      
      case 'genre':
        if (!value) return 'Genre is required';
        if (value.length < 2) return 'Genre must be at least 2 characters long';
        if (value.length > 50) return 'Genre must not exceed 50 characters';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(book).forEach(key => {
      const error = validateField(key, book[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, book[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            if (img.width < 300 || img.height < 300) {
              setErrors(prev => ({ ...prev, coverImage: 'Image dimensions must be at least 300x300 pixels' }));
              return;
            }
            if (img.width > 2000 || img.height > 2000) {
              setErrors(prev => ({ ...prev, coverImage: 'Image dimensions must not exceed 2000x2000 pixels' }));
              return;
            }
            if (file.size > 5 * 1024 * 1024) {
              setErrors(prev => ({ ...prev, coverImage: 'Image file size must not exceed 5MB' }));
              return;
            }
            setCoverPreview(reader.result);
            setBook(prev => ({ ...prev, coverImage: file }));
            setErrors(prev => ({ ...prev, coverImage: '' }));
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        setErrors(prev => ({ ...prev, coverImage: 'Please upload an image file for the cover page' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(book);
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('title', book.title.trim());
      formData.append('author', book.author.trim());
      formData.append('description', book.description.trim() || 'No description available');
      formData.append('bookText', book.bookText.trim());
      formData.append('category', book.category);
      formData.append('publishedYear', new Date(book.publishedDate).getFullYear());
      formData.append('genre', book.genre.trim());

      // Append cover image if it's a new file
      if (book.coverImage instanceof File) {
        formData.append('coverImage', book.coverImage);
      }

      const response = await axiosInstance.put(`/api/books/${isbn}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('Book updated successfully!');
        navigate('/a-booklist');
      }
    } catch (err) {
      console.error('Update failed:', err);
      let errorMessage = 'Failed to update book. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/a-booklist');
  };

  if (isLoading) {
    return (
      <div className="update-book-loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="update-book-error">
        <p>{errors.fetch}</p>
        <button onClick={() => navigate('/a-booklist')}>Back to Book List</button>
      </div>
    );
  }

  return (
    <div className="book-form-container">
      <div className="book-form-header">
        <h2>Update Book</h2>
      </div>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={book.isbn}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Book Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.title && errors.title ? 'error' : ''}`}
              required
            />
            {touchedFields.title && errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.author && errors.author ? 'error' : ''}`}
              required
            />
            {touchedFields.author && errors.author && (
              <div className="error-message">{errors.author}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={book.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.category && errors.category ? 'error' : ''}`}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {touchedFields.category && errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="publishedDate">Date of Published</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={book.publishedDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.publishedDate && errors.publishedDate ? 'error' : ''}`}
              required
            />
            {touchedFields.publishedDate && errors.publishedDate && (
              <div className="error-message">{errors.publishedDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.genre && errors.genre ? 'error' : ''}`}
              required
            />
            {touchedFields.genre && errors.genre && (
              <div className="error-message">{errors.genre}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={book.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="4"
              className={`form-control ${touchedFields.description && errors.description ? 'error' : ''}`}
              required
            />
            {touchedFields.description && errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="bookText">Book Text</label>
            <textarea
              id="bookText"
              name="bookText"
              value={book.bookText}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="8"
              className={`form-control ${touchedFields.bookText && errors.bookText ? 'error' : ''}`}
              placeholder="Enter the book's text content here..."
            />
            {touchedFields.bookText && errors.bookText && (
              <div className="error-message">{errors.bookText}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              id="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className={`form-control ${touchedFields.coverImage && errors.coverImage ? 'error' : ''}`}
            />
            {touchedFields.coverImage && errors.coverImage && (
              <div className="error-message">{errors.coverImage}</div>
            )}
            {coverPreview && (
              <div className="image-preview">
                <img src={coverPreview} alt="Cover Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Book'}
          </button>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default UpdateBook;

