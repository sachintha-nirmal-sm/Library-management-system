import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import components
// Import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages from both branches
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import About from "./pages/About";
import GetStartedPage from "./pages/GetStartedPage";
import IForme from "./pages/i-forme"; 
import BookList from "./pages/i-booklist"; 
import UpdateBook from "./pages/i-UpdateBook";
import OverdueForm from "./pages/i-pform";
import IPaymentTable from "./pages/i-payment";
import CashPayment from "./pages/i-cash"; // Ensure correct path
import CardPayment from "./pages/i-card";
import NotificationForm from "./pages/notification";

import EmyLibrary from "./pages/EmyLibrary";
import Home1 from "./pages/Home1"; // Home1 page
import BookModal from "./components/BookModal"; // BookModal component
import BookForm from "./components/BookForm"; // BookForm component
import Sidebar from "./components/Sidebar";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";
import UpdateBorrowedBookForm from "./pages/BorrowUpdate";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  console.log("📍 Current Path:", location.pathname);

  // Hide Navbar and Footer on specific pages (like "/get-started")
  const hideNavbarAndFooter = location.pathname === "/get-started";
  
  return (
    <>
      {/* Conditionally render Navbar based on page */}
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Keep both Home routes and make Home1 a separate route */}
        <Route path="/" element={<Home />} />
        <Route path="/home1" element={<Home1 />} />

        {/* Other general routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />

        {/* Book management routes */}
        <Route path="/bookform" element={<IForme />} />
        <Route path="/booklist" element={<BookList />} />
        <Route path="/update-book" element={<UpdateBook />} />
        <Route path="/overdue-form" element={<OverdueForm />} />
        <Route path="/payment-table" element={<IPaymentTable />} />
        <Route path="/cash-payment/:id/:total" element={<CashPayment />} />
        <Route path="/card-payment/:id/:total" element={<CardPayment />} />

        <Route path="/notification" element={<NotificationForm />} />

         {/* Library management routes */}
         <Route path="/mylibrary" element={<EmyLibrary />} />
        <Route path="/bookmodel" element={<BookModal />} />
        <Route path="/bookform" element={<BookForm />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />
        <Route path="/borrowerupdate" element={<UpdateBorrowedBookForm />} />
      </Routes>
      
      {/* Conditionally render Footer based on page */}
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
