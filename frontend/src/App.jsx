import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import components
import Footer from "./components/Footer";
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
import CashPayment from "./pages/i-cash"; 
import CardPayment from "./pages/i-card";
import NotificationForm from "./pages/notification"; // ✅ Correct import for Notification page

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

  const hideNavbarAndFooter = location.pathname === "/get-started";

  return (
    <>
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
        <Route path="/cash-payment/:id/:total" element={<CashPayment />} />
        <Route path="/card-payment/:id/:total" element={<CardPayment />} />
        <Route path="/notification" element={<NotificationForm />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
