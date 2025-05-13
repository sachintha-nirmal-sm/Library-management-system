import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import UserAnalytics from "../components/UserAnalytics";
import "./UserAdmin.css";

const UserAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAllUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized: You do not have permission to access this page.');
        } else {
          setError(err.response?.data?.message || 'Failed to load users');
        }
        console.error('Error fetching users:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.userId?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.address?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirmDelete) {
      try {
        const response = await userAPI.deleteUser(userId);
        if (response.data.success) {
          setUsers(users.filter(user => user._id !== userId));
          setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
        } else {
          setError("Failed to delete user");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      username: user.username || '',
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user'
    });
  };

  const handleUpdate = async (userId) => {
    try {
      const response = await userAPI.updateUser(userId, editForm);
      if (response.data.success) {
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, ...response.data.data } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditingId(null);
        setError(null);
      } else {
        setError("Failed to update user");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      username: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      role: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-admin-container">
      <h2>User Management</h2>
      
      <UserAnalytics users={users} />
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by any field..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-users">No users found</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className={user.role === 'admin' ? 'admin-row' : ''}>
                <td>{user.userId}</td>
                {editingId === user._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleInputChange}
                        className="edit-input"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        className="save-button"
                        onClick={() => handleUpdate(user._id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="update-button"
                        onClick={() => handleEdit(user)}
                      >
                        Update
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserAdmin;
