import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-forme.css";

const IForme = () => {
  const navigate = useNavigate();

  // Combined category list from both branches
  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education",
    "Biography",
    "Fiction",
    "Poetry",
    "Children",
    "Science",
    "Travel",
  ];

  // Helper: generate a random 6-digit ISBN string
  const generateISBN = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // Form state
  const [book, setBook] = useState({
    isbn: "",
    name: "",
    author: "",
    category: categories[0],
    publishedDate: "",
  });

  // On mount, generate initial ISBN
  useEffect(() => {
    setBook((prev) => ({ ...prev, isbn: generateISBN() }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ISBN: book.isbn,
      BookName: book.name,
      Author: book.author,
      Category: book.category,
      PublishedDate: book.publishedDate,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/inventorys",
        payload
      );
      alert(res.data.msg || "Book added successfully!");

      // Reset form (new ISBN + empty fields)
      setBook({
        isbn: generateISBN(),
        name: "",
        author: "",
        category: categories[0],
        publishedDate: "",
      });

      navigate("/booklist");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. See console for details.");
    }
  };

  // Cancel resets the form
  const handleCancel = () => {
    setBook({
      isbn: generateISBN(),
      name: "",
      author: "",
      category: categories[0],
      publishedDate: "",
    });
  };

  return (
    <div className="Bcontainer">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ISBN:</label>
          <input
            type="text"
            name="isbn"
            value={book.isbn}
            readOnly
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Book Name:</label>
          <input
            type="text"
            name="name"
            value={book.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={book.category}
            onChange={handleChange}
            className="form-control"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Published Date:</label>
          <input
            type="date"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="custom-btn submit-btn">
            Add
          </button>
          <button
            type="button"
            className="custom-btn cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IForme;
