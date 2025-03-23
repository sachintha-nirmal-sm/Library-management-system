import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Home from "./pages/Home";  // Ensure Home is imported
import About from "./pages/About";
import Footer from "./components/Footer";
import GetStartedPage from "./pages/GetStartedPage"; 
import Sidebar from "./components/Sidebar";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";
import Transactions from "./pages/transactions";
import UpdateBorrowedBookForm from"./pages/BorrowUpdate";

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

  const hideNavbarAndFooter = location.pathname === "/get-started";

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page added correctly here */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/Borrowerupdate"element={<UpdateBorrowedBookForm/>}/>
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
