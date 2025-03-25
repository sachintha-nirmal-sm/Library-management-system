import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import About from "./pages/About";
import GetStartedPage from "./pages/GetStartedPage";
import IForme from "./pages/i-forme"; // Book form page
import BookList from "./pages/i-booklist"; // Book list page
import UpdateBook from "./pages/i-UpdateBook";
import OverdueForm from "./pages/i-pform";
import IPaymentTable from "./pages/i-payment";
import CashPayment from "./pages/i-cash"; // Ensure correct path
import CardPayment from "./pages/i-card";

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

  // Hide Navbar and Footer on specific pages
  const hideNavbarAndFooter = location.pathname === "/get-started";

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/bookform" element={<IForme />} />
        <Route path="/booklist" element={<BookList />} />
        <Route path="/update-book" element={<UpdateBook />} />
        <Route path="/overdue-form" element={<OverdueForm />} />
        <Route path="/payment-table" element={<IPaymentTable />} />
        <Route path="/cash-payment/:id/:total" element={<CashPayment />} /> {/* ✅ Fixed Route */}
        <Route path="/card-payment/:id/:total" element={<CardPayment />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
