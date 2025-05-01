import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import BookModal from "./components/BookModal";
import BookForm from "./components/BookForm";

// Pages
import Home from "./pages/Home";
import Home1 from "./pages/Home1";
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
import EmyLibrary from "./pages/EmyLibrary";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";
import UpdateBorrowedBookForm from "./pages/BorrowUpdate";
import Signup from "./pages/Signup";
import MoodBasedBookRecommendation from "./pages/MoodBasedBookRecommendation";
import UserAccount from "./pages/UserAccount";
import UserAdmin from "./pages/UserAdmin";

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
        <Route path="/" element={<Home1 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home1" element={<Home1 />} />
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
        <Route path="/mylibrary" element={<EmyLibrary />} />
        <Route path="/bookmodel" element={<BookModal />} />
        <Route path="/bookform-component" element={<BookForm />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />
        <Route path="/borrowerupdate" element={<UpdateBorrowedBookForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/MoodBasedBookRecommendation" element={<MoodBasedBookRecommendation />} />
        <Route path="/UserAccount" element={<UserAccount />} />
        <Route path="/UserAdmin" element={<UserAdmin />} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
