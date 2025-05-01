import React, { useState, useEffect } from "react";
import "./UserAdmin.css";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Stores the user being edited
  const [editedData, setEditedData] = useState({
    profilePhoto: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleDelete = (userID) => {
    const updatedUsers = users.filter((user) => user.userID !== userID);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleEdit = (user) => {
    setEditingUser(user.userID); // Set the user being edited
    setEditedData({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({ ...editedData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const updatedUsers = users.map((user) =>
      user.userID === editingUser ? { ...user, ...editedData } : user
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setEditingUser(null); // Exit edit mode
  };

  return (
    <div className="user-admin-container">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Profile Photo</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" width="50" />
                ) : (
                  "No Photo"
                )}
              </td>
              <td>{user.userID}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.userID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingUser && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <label>Profile Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {editedData.profilePhoto && <img src={editedData.profilePhoto} alt="Preview" width="50" />}

          <label>Name:</label>
          <input type="text" name="name" value={editedData.name} onChange={handleInputChange} />

          <label>Email:</label>
          <input type="email" name="email" value={editedData.email} onChange={handleInputChange} />

          <label>Phone:</label>
          <input type="tel" name="phone" value={editedData.phone} onChange={handleInputChange} />

          <label>Address:</label>
          <input type="text" name="address" value={editedData.address} onChange={handleInputChange} />

          <button className="update-button" onClick={handleUpdate}>Update</button>
          <button className="cancel-button" onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
