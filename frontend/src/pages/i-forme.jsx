import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./i-forme.css";

const IForme = () => {
  const [book, setBook] = useState({
    isbn: "",
    name: "",
    author: "",
    category: "Novel",
    publishedDate: "",
  });

  const navigate = useNavigate();

  const categories = [
    "Novel",
    "Biography",
    "Fiction",
    "Poetry",
    "Children",
    "Fantasy",
    "Science",
    "Travel",
  ];

  // Auto-generate ISBN on mount
  useEffect(() => {
    setBook((prev) => ({ ...prev, isbn: generateISBN() }));
  }, []);

  const generateISBN = () => {
    return "ISBN" + Date.now();
  };

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

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
      const response = await axios.post("http://localhost:5000/api/inventorys", payload);
      alert(response.data.msg || "Book added successfully!");

      // Reset form
      setBook({
        isbn: generateISBN(),
        name: "",
        author: "",
        category: "Novel",
        publishedDate: "",
      });

      navigate("/booklist"); // Navigate to the book list
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please check console for details.");
    }
  };

  return (
    <div className="Bcontainer">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="isbn">ISBN:</label>
          <input type="text" name="isbn" value={book.isbn} readOnly />
        </div>
        <div>
          <label htmlFor="name">Book Name:</label>
          <input type="text" name="name" value={book.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input type="text" name="author" value={book.author} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select name="category" value={book.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="publishedDate">Published Date:</label>
          <input type="date" name="publishedDate" value={book.publishedDate} onChange={handleChange} required />
        </div>

        <div className="form-buttons">
          <button type="submit" className="custom-btn submit-btn">
            Add
          </button>
          <button
            type="button"
            className="custom-btn cancel-btn"
            onClick={() =>
              setBook({
                isbn: generateISBN(),
                name: "",
                author: "",
                category: "Novel",
                publishedDate: "",
              })
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IForme;
