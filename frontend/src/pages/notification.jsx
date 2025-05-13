import React, { useState, useEffect } from "react";
import "./notification.css";

const NotificationForm = () => {
  const generateUserId = () => Math.floor(1000 + Math.random() * 9000);

  const [formData, setFormData] = useState({
    userId: "",
    message: "",
    date: new Date().toISOString().split("T")[0],
    recipient: "all",
  });

  const [notifications, setNotifications] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (formData.recipient === "user") {
      setFormData((prev) => ({ ...prev, userId: generateUserId() }));
    } else {
      setFormData((prev) => ({ ...prev, userId: "" }));
    }
  }, [formData.recipient]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();
      if (response.ok) setNotifications(data);
      else alert("Failed to load notifications");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Message: formData.message,
      Date: formData.date,
      SendTO: formData.recipient === "all" ? "All" : `User (${formData.userId})`,
    };

    try {
      if (editingIndex !== null) {
        const id = notifications[editingIndex]._id;
        const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Update failed");
        alert("Notification Updated Successfully!");
      } else {
        const response = await fetch("http://localhost:5000/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Creation failed");
        alert("Notification Submitted Successfully!");
      }

      setFormData({
        userId: "",
        message: "",
        date: new Date().toISOString().split("T")[0],
        recipient: "all",
      });
      setEditingIndex(null);
      fetchNotifications();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (index) => {
    const notification = notifications[index];
    const recipientMatch = /User \((\d+)\)/.exec(notification.SendTO);
    setFormData({
      userId: recipientMatch ? recipientMatch[1] : "",
      message: notification.Message,
      date: notification.Date,
      recipient: notification.SendTO === "All" ? "all" : "user",
    });
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const id = notifications[index]._id;
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Delete failed");
      alert("Notification Deleted Successfully!");
      fetchNotifications();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="notification-form-container">
      <h2>{editingIndex !== null ? "Edit Notification" : "Send Notification"}</h2>
      <form onSubmit={handleSubmit} className="notification-form">
        <label>Message:</label>
        <textarea name="message" value={formData.message} onChange={handleChange} required />

        <label>Date:</label>
        <input type="date" name="date" value={formData.date} readOnly />

        <label>Send To:</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="recipient" value="all" checked={formData.recipient === "all"} onChange={handleChange} />
            For All
          </label>
          <label>
            <input type="radio" name="recipient" value="user" checked={formData.recipient === "user"} onChange={handleChange} />
            User
          </label>
        </div>

        {formData.recipient === "user" && (
          <>
            <label>User ID:</label>
            <input type="text" name="userId" value={formData.userId} readOnly />
          </>
        )}

        <button type="submit">{editingIndex !== null ? "Update Notification" : "Send Notification"}</button>
      </form>

      {notifications.length > 0 && (
        <div className="notification-list">
          <h3>Notification List</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={notification._id}>
                <p><strong>Message:</strong> {notification.Message}</p>
                <p><strong>Date:</strong> {notification.Date}</p>
                <p><strong>Recipient:</strong> {notification.SendTO}</p>
                <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationForm;
