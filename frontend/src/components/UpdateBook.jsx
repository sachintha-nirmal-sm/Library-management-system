import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './UpdateBook.css';

const UpdateBook = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    publishedYear: '',
    genre: '',
    coverImage: null,
    pdfFile: null,
    available: true
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education",
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${isbn}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        setBook({
          ...data,
          publishedDate: data.publishedYear ? new Date(data.publishedYear, 0).toISOString().split('T')[0] : '',
          category: data.genre || 'Novel'
        });
        setCoverPreview(data.coverImage);
        setPdfName(data.pdfFile);
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
        return '';
      
      case 'author':
        if (!value) return 'Author is required';
        if (value.length < 2) return 'Author name must be at least 2 characters long';
        if (value.length > 50) return 'Author name must not exceed 50 characters';
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'cover') {
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
              setBook(prev => ({ ...prev, coverImage: file.name }));
              setErrors(prev => ({ ...prev, coverImage: '' }));
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        } else {
          setErrors(prev => ({ ...prev, coverImage: 'Please upload an image file for the cover page' }));
        }
      } else if (type === 'pdf') {
        if (file.type === 'application/pdf') {
          if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, pdfFile: 'PDF file size must not exceed 10MB' }));
            return;
          }
          setBook(prev => ({ ...prev, pdfFile: file.name }));
          setPdfName(file.name);
          setErrors(prev => ({ ...prev, pdfFile: '' }));
        } else {
          setErrors(prev => ({ ...prev, pdfFile: 'Please upload a PDF file' }));
        }
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
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', book.title.trim());
      formData.append('author', book.author.trim());
      formData.append('description', book.description.trim() || "No description available");
      formData.append('publishedYear', new Date(book.publishedDate).getFullYear());
      formData.append('genre', book.category.trim());
      formData.append('available', true);

      // Only append files if they exist
      if (book.coverImage instanceof File) {
        formData.append('coverImage', book.coverImage);
      }
      if (book.pdfFile instanceof File) {
        formData.append('pdfFile', book.pdfFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/books/${isbn}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('Book updated successfully!');
        navigate('/a-booklist');
      } else {
        throw new Error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Error updating book. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/a-booklist");
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
        <button onClick={() => navigate("/a-booklist")}>Back to Book List</button>
      </div>
    );
  }

  return (
    <div className="update-book-container">
      <div className="update-book-header">
        <h2>Update Book</h2>
      </div>
      <form onSubmit={handleSubmit} className="update-book-form">
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
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
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

          <div className="form-group">
            <label htmlFor="pdfFile">PDF File</label>
            <input
              type="file"
              id="pdfFile"
              onChange={(e) => handleFileChange(e, 'pdf')}
              accept="application/pdf"
              className={`form-control ${touchedFields.pdfFile && errors.pdfFile ? 'error' : ''}`}
            />
            {touchedFields.pdfFile && errors.pdfFile && (
              <div className="error-message">{errors.pdfFile}</div>
            )}
            {pdfName && (
              <div className="file-name">{pdfName}</div>
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

