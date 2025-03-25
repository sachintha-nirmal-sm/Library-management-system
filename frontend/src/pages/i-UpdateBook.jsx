import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./i-UpdateBook.css";

const UpdateBook = () => {
  const { state } = useLocation();
  const { book } = state || {}; // Retrieve the book passed from the BookList page

  const [updatedBook, setUpdatedBook] = useState(book || {});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook({ ...updatedBook, [name]: value });
  };

  const handleUpdate = () => {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = storedBooks.map((b) =>
      b.isbn === updatedBook.isbn ? updatedBook : b
    );
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    navigate("/booklist"); // Redirect back to the BookList page
  };

  return (
    <div className="Ucontainer">
      <h2>Update Book</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={updatedBook.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={updatedBook.author || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            name="category"
            value={updatedBook.category || ""}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-success" onClick={handleUpdate}>
          OK
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
