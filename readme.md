# 📚 Library Management System

A comprehensive MERN stack-based Library Management System that simplifies and streamlines library operations with modern digital solutions. This system offers robust features such as user management, inventory tracking, e-library access, and book lending/returning services. It also includes an innovative *Mood-Based Book Recommendation System* to enhance user experience.

---

## 🔧 Features

### ✅ User Management
- User registration, login, and profile management
- Role-based access (e.g., admin, user)

### 📦 Inventory Management
- Add, update, delete books
- Track stock levels and categories

### 💻 E-Library Management
- Access and read digital copies of books
- Manage digital content and file uploads

### 🔄 Book Borrowing & Returning
- Issue and return book records
- Due date tracking and overdue notifications

### 🎭 Mood-Based Book Recommendation
- Suggests books based on the user’s inferred mood
- Enhances reading experience using emotion-based algorithms

---

## 🚀 Tech Stack

- *Frontend:* React.js, Tailwind CSS
- *Backend:* Node.js, Express.js
- *Database:* MongoDB with Mongoose
- *Authentication:* JWT
- *Other:* Cloudinary (for images/PDFs), RESTful APIs

---

## 🛠 Installation

1. *Clone the repository:*
   ```bash
   git clone https://github.com/sachintha-nirmal-sm/Library-management-system.git
   cd library-management-system
   ```
2. *Backend Setup:*

```bash
cd backend
npm install
npm run dev
```
3. *Frontend Setup:*

```bash
cd frontend
npm install
npm start
```

4. Environment Variables: Create .env files in both frontend and backend folders with appropriate configuration (MongoDB URI, JWT secret, etc.)

📂 Folder Structure
```
library-management-system/
├── backend/
│   ├── models/
│   ├── routes/
│   └── controllers/
├── frontend/
│   ├── src/
│   └── public/

```
---
🤝 Contributing
Feel free to fork this repo and make contributions. Pull requests are welcome!

📄 License
MIT License
