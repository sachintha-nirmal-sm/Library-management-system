import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Home from "./pages/Home";  // Ensure Home is imported
import About from "./pages/About";
import Footer from "./components/Footer";

// Merging imports from both branches
import GetStartedPage from "./pages/GetStartedPage";
import EmyLibrary from "./pages/EmyLibrary";
import Home1 from "./pages/Home1"; // Importing Home1
import BookModal from "./components/BookModal"; // Importing BookModal component
import BookForm from "./components/BookForm"; // Importing BookForm component

import Sidebar from "./components/Sidebar";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";
// import Transactions from "./pages/transactions";
import UpdateBorrowedBookForm from "./pages/BorrowUpdate";

function App() {
  console.log("App component is rendering!");
  return (
    <Router>
      {console.log("🔄 Rendering MainContent")}
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  console.log("📍 Current Path:", location.pathname);

  return (
    <>
      <Routes>
        {/* Keeping both Home routes and making Home1 a separate route if needed */}
        <Route path="/" element={<Home />} />
        <Route path="/home1" element={<Home1 />} /> 

        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />

        {/* Merging routes from both branches */}
        <Route path="/mylibrary" element={<EmyLibrary />} />
        <Route path="/bookmodel" element={<BookModal />} />
        <Route path="/bookform" element={<BookForm />} />

        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />
        {/* <Route path="/transactions" element={<Transactions />} /> */}
        <Route path="/borrowerupdate" element={<UpdateBorrowedBookForm />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
