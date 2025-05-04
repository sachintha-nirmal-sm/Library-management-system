import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookForm.css";

const BookForm = () => {
  const [book, setBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Novel",
    publishedDate: "",
    pages: 0,
    formats: ["PDF"],
    description: "No description available",
    coverImage: null,
    pdfFile: null,
    genre: ""
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education",
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
      
      case 'pages':
        if (!value) return 'Number of pages is required';
        if (value < 1) return 'Number of pages must be at least 1';
        if (value > 10000) return 'Number of pages must not exceed 10000';
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
      
      case 'publishedYear':
        if (value > new Date().getFullYear()) return 'Published year cannot be in the future';
        return '';
      
      case 'formats':
        if (!value || value.length === 0) return 'At least one format must be selected';
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
      } else if (type === 'pdf') {
        if (file.type === 'application/pdf') {
          if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, pdfFile: 'PDF file size must not exceed 10MB' }));
            return;
          }
          setBook(prev => ({ ...prev, pdfFile: file }));
          setPdfName(file.name);
          setErrors(prev => ({ ...prev, pdfFile: '' }));
        } else {
          setErrors(prev => ({ ...prev, pdfFile: 'Please upload a PDF file' }));
        }
      }
    }
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get file inputs
    const coverImageInput = document.getElementById('coverImage');
    const pdfFileInput = document.getElementById('pdfFile');

    try {
      // Upload cover image
      const coverFormData = new FormData();
      coverFormData.append('file', coverImageInput.files[0]);
      const coverResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: coverFormData // NO headers needed for FormData
      });
      const coverData = await coverResponse.json();

      // Upload PDF
      const pdfFormData = new FormData();
      pdfFormData.append('file', pdfFileInput.files[0]);
      const pdfResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: pdfFormData
      });
      const pdfData = await pdfResponse.json();

      // Create book with file IDs
      const bookData = {
        title: book.title,
        author: book.author,
        coverImage: coverData.fileId, // Use fileId directly
        pdfFile: pdfData.fileId, // Use fileId directly
        isbn: book.isbn,
        description: book.description,
        publishedYear: new Date(book.publishedDate).getFullYear(),
        genre: book.category,
        pages: book.pages
      };

      const bookResponse = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      if (bookResponse.ok) {
        alert('Book added successfully!');
        navigate('/');
      } else {
        console.error('Error creating book:', await bookResponse.text());
        setErrors({ submit: 'Failed to create book. Please try again.' });
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setErrors({ submit: 'File upload failed. Please try again.' });
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
      pages: 0,
      formats: ["PDF"],
      description: "No description available",
      coverImage: null,
      pdfFile: null
    });
    setCoverPreview(null);
    setPdfName("");
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

          <div className="form-group">
            <label htmlFor="pages">Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={book.pages}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max="10000"
              className={`form-control ${touchedFields.pages && errors.pages ? 'error' : ''}`}
              required
            />
            {touchedFields.pages && errors.pages && (
              <div className="error-message">{errors.pages}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="formats">Formats</label>
            <input
              type="text"
              id="formats"
              name="formats"
              value={book.formats.join(', ')}
              onChange={(e) => {
                const formats = e.target.value.split(',').map(f => f.trim());
                setBook(prev => ({ ...prev, formats }));
                if (touchedFields.formats) {
                  const error = validateField('formats', formats);
                  setErrors(prev => ({ ...prev, formats: error }));
                }
              }}
              onBlur={handleBlur}
              className={`form-control ${touchedFields.formats && errors.formats ? 'error' : ''}`}
              required
            />
            {touchedFields.formats && errors.formats && (
              <div className="error-message">{errors.formats}</div>
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
