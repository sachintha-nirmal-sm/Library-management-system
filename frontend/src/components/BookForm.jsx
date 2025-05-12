import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/axiosInstance';
import "./BookForm.css";

const BookForm = () => {
  const [book, setBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Novel",
    publishedDate: "",
    description: "",
    bookText: "",
    coverImage: null,
    genre: ""
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education"
  ];

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
        if (!value || value.trim().length === 0) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters long';
        if (value.length > 1000) return 'Description must not exceed 1000 characters';
        return '';
      
      case 'publishedDate':
        if (!value) return 'Published date is required';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Invalid date format';
        if (date > new Date()) return 'Published date cannot be in the future';
        return '';
      
      case 'publishedYear':
        if (value > new Date().getFullYear()) return 'Published year cannot be in the future';
        return '';
      
      case 'bookText':
        if (!value || value.trim().length === 0) return 'Book text is required';
        if (value.length < 10) return 'Book text must be at least 10 characters long';
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

  const generateISBN = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const randomNum = Math.floor(Math.random() * 100) + 1;
    return `${year}${month}${day}${String(randomNum).padStart(2, "0")}`;
  };

  useEffect(() => {
    setBook(prevBook => ({
      ...prevBook,
      isbn: generateISBN(),
    }));
  }, []);

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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'cover') {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCoverPreview(reader.result);
            setBook(prev => ({ ...prev, coverImage: file }));
            setErrors(prev => ({ ...prev, coverImage: '' }));
          };
          reader.readAsDataURL(file);
        } else {
          setErrors(prev => ({ ...prev, coverImage: 'Please upload an image file' }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(book);
    setTouchedFields(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('title', book.title.trim());
      formData.append('author', book.author.trim());
      formData.append('isbn', book.isbn.trim());
      formData.append('description', book.description.trim() || 'No description available');
      formData.append('bookText', book.bookText.trim());
      formData.append('category', book.category);
      formData.append('publishedYear', new Date(book.publishedDate).getFullYear());

      // Append cover image if exists
      if (book.coverImage instanceof File) {
        formData.append('coverImage', book.coverImage);
      }

      const response = await axiosInstance.post('/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        alert('Book added successfully!');
        navigate('/a-booklist');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      let errorMessage = 'Failed to add book. Please try again.';
      
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
    setBook({
      isbn: generateISBN(),
      title: "",
      author: "",
      category: "Novel",
      publishedDate: "",
      genre: "",
      description: "",
      bookText: "",
      coverImage: null
    });
    setCoverPreview(null);
    setErrors({});
    setTouchedFields({});
  };

  return (
    <div className="book-form-container">
      <div className="book-form-header">
        <h2>Add New Book</h2>
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
              className={`form-control ${touchedFields.isbn && errors.isbn ? 'error' : ''}`}
            />
            {touchedFields.isbn && errors.isbn && (
              <div className="error-message">{errors.isbn}</div>
            )}
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
            <label htmlFor="description">Description <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              id="description"
              name="description"
              value={book.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.description && errors.description ? 'error' : ''}`}
              required
              placeholder="No description available"
              maxLength={1000}
            />
            {touchedFields.description && errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="bookText">Book Text <span style={{color: 'red'}}>*</span></label>
            <textarea
              id="bookText"
              name="bookText"
              value={book.bookText}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="8"
              className={`form-control ${touchedFields.bookText && errors.bookText ? 'error' : ''}`}
              required
              placeholder="Enter the full text/content of the book here..."
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
              onChange={(e) => handleFileChange(e, 'cover')}
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
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </button>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default BookForm;
