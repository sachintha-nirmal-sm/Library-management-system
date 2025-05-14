import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./i-UpdateBook.css";

const UpdateBook = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { book } = state || {};

  // If no book was passed, go back to list
  useEffect(() => {
    if (!book?._id) {
      navigate("/booklist");
    }
  }, [book, navigate]);

  const [updatedBook, setUpdatedBook] = useState({
    ISBN: "",
    BookName: "",
    Author: "",
    Category: "",
    PublishedDate: "",
    _id: "",
  });

  // Populate form when book becomes available
  useEffect(() => {
    if (book) {
      setUpdatedBook({
        ISBN: book.ISBN || "",
        BookName: book.BookName || "",
        Author: book.Author || "",
        Category: book.Category || "",
        PublishedDate: book.PublishedDate || "",
        _id: book._id,
      });
    }
  }, [book]);

  const categories = [
   "Novel",
    "Biography",
    "Fiction",
    "Poetry",
    "Children",
    "Fantasy",
    "Science",
    "Travel",
    "Adventure",
    "Mystry&Thriller",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/inventorys/${updatedBook._id}`,
        {
          ISBN: updatedBook.ISBN,
          BookName: updatedBook.BookName,
          Author: updatedBook.Author,
          Category: updatedBook.Category,
          PublishedDate: updatedBook.PublishedDate,
        }
      );
      alert("Book updated successfully!");
      navigate("/booklist");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update book. See console for details.");
    }
  };

  return (
    <div className="Ucontainer">
      <h2>Update Book</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* ISBN (read-only) */}
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            name="ISBN"
            value={updatedBook.ISBN}
            readOnly
          />
        </div>

        {/* Book Name */}
        <div className="mb-3">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            name="BookName"
            value={updatedBook.BookName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="Author"
            value={updatedBook.Author}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            name="Category"
            value={updatedBook.Category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Published Date */}
        <div className="mb-3">
          <label className="form-label">Published Date</label>
          <input
            type="date"
            className="form-control"
            name="PublishedDate"
            value={updatedBook.PublishedDate}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleUpdate}
        >
          OK
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
