import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./i-forme.css";

const IForme = () => {
  const [book, setBook] = useState({
    isbn: "", // Empty initially, will be generated
    name: "",
    author: "",
    category: "Novel",
    publishedDate: "",
  });

  const navigate = useNavigate(); // React Router navigation

  const categories = [
    "Novel",
    "Horror",
    "Adventure",
    "Mystery & Thriller",
    "Romance",
    "Fantasy",
    "Education",
  ];

  // Function to generate ISBN
  const generateISBN = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // Current year
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Current month (pad to 2 digits)
    const day = String(currentDate.getDate()).padStart(2, "0"); // Current day (pad to 2 digits)
    const randomNum = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100

    // Concatenate to form the ISBN (e.g., "2024032112")
    return `${year}${month}${day}${String(randomNum).padStart(2, "0")}`;
  };

  // Auto-generate ISBN when the component is mounted
  useEffect(() => {
    setBook((prevBook) => ({
      ...prevBook,
      isbn: generateISBN(), // Set initial ISBN value
    }));
  }, []);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto-generate ISBN if not set (in case the user manually changes it)
    const newBook = { ...book, isbn: book.isbn || generateISBN() };

    // Get previous books from localStorage
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = [...storedBooks, newBook];

    // Save the updated books list
    localStorage.setItem("books", JSON.stringify(updatedBooks));

    alert("Book added successfully!");

    // Navigate to the BookList page
    navigate("/booklist");

    // Reset the form
    setBook({ isbn: "", name: "", author: "", category: "Novel", publishedDate: "" });
  };

  const handleCancel = () => {
    setBook({ isbn: "", name: "", author: "", category: "Novel", publishedDate: "" });
  };

  return (
    <div className="Bcontainer">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            required
            disabled // Disable the input as it is auto-generated
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={book.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            name="category"
            value={book.category}
            onChange={handleChange}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Published</label>
          <input
            type="date"
            className="form-control"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="custom-btn submit-btn">
            Add
          </button>
          <button type="button" className="custom-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IForme;
