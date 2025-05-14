import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./i-UpdateBook.css";

const UpdateBook = () => {
  const { state } = useLocation();
  const { book } = state || {};

  const [updatedBook, setUpdatedBook] = useState(book || {});
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
    "Adventure",
    "Mystry&Thriller",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook({ ...updatedBook, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/inventorys/${updatedBook._id}`, updatedBook);
      alert("Book updated successfully!");
      navigate("/booklist");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update book.");
    }
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
            name="BookName"
            value={updatedBook.BookName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="Author"
            value={updatedBook.Author || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            name="Category"
            value={updatedBook.Category || ""}
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
        <div className="mb-3">
          <label className="form-label">Published Date</label>
          <input
            type="date"
            className="form-control"
            name="PublishedDate"
            value={updatedBook.PublishedDate || ""}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-success" onClick={handleUpdate}>
          OK
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
