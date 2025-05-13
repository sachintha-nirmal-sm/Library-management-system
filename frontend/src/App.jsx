import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

// import Navbar from "./components/Navbar";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import BookForm from "./components/BookForm";
import UpdateBook from "./components/UpdateBook";
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Home1 from "./pages/Home1";

import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import EmyLibrary from "./pages/EmyLibrary";
import CategoryPage from "./pages/CategoryPage";
import LearnMore from "./pages/h-Learnmore";
import WatchLater from "./pages/WatchLater";
import BookDetails from "./pages/BookDetails";
import GetStartedPage from "./pages/GetStartedPage";
import IForme from "./pages/i-forme";
import IBookList from "./pages/i-booklist";
import IUpdateBook from "./pages/i-UpdateBook";
import OverdueForm from "./pages/i-pform";
import IPaymentTable from "./pages/i-payment";
import CashPayment from "./pages/i-cash";
import CardPayment from "./pages/i-card";
import NotificationForm from "./pages/notification";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";

import Transactions from "./pages/transactions";
import UpdateBorrowedBookForm from"./pages/BorrowUpdate";
import Analyze from "./pages/Analyze";

import UpdateBorrowedBookForm from "./pages/BorrowUpdate";

import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

// App content component to manage conditional layout and modals
function MainContent() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const hideNavbarAndFooter = location.pathname === "/get-started";

  // Optional Cloudinary image transformation (example use case)
  const cld = new Cloudinary({ cloud: { cloudName: "dq0zuo86p" } });
  const img = cld
    .image("cld-sample-5")
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(500).height(500));

  return (
    <>
      {/* {!hideNavbarAndFooter && <Navbar />} */}
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        {/* Home routes */}
        <Route path="/" element={<Home1/>} />
        <Route path="/home1" element={<Home />} />
     

        {/* Auth and info */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />

        {/* Library and Books */}
        <Route path="/mylibrary" element={<EmyLibrary />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/h-Learnmore" element={<LearnMore />} />
        <Route path="/watchlater" element={<WatchLater />} />
        <Route path="/book/:isbn" element={<BookDetails />} />

        {/* Book modals and forms */}
        <Route path="/bookmodel" element={<BookModal />} />
        <Route path="/a-bookform" element={<BookForm />} />
        <Route path="/a-updatebook/:isbn" element={<UpdateBook />} />
        <Route path="/a-booklist" element={<BookList onBookClick={handleBookClick} />} />

        {/* "i-" prefixed pages */}
        <Route path="/bookform" element={<IForme />} />
        <Route path="/booklist" element={<IBookList />} />
        <Route path="/update-book" element={<IUpdateBook />} />
        <Route path="/overdue-form" element={<OverdueForm />} />
        <Route path="/payment-table" element={<IPaymentTable />} />
        <Route path="/cash-payment/:id/:total" element={<CashPayment />} />
        <Route path="/card-payment/:id/:total" element={<CardPayment />} />
        <Route path="/notification" element={<NotificationForm />} />

        {/* Admin/Dashboard features */}
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />

          <Route path="/transactions" element={<Transactions />} />
        <Route path="/Borrowerupdate"element={<UpdateBorrowedBookForm/>}/>
        <Route path="/banalyze" element={<Analyze/>}/>
        
        <Route path="/borrowerupdate" element={<UpdateBorrowedBookForm />} />

          </Routes>

      {isModalOpen && selectedBook && (
        <BookModal book={selectedBook} onClose={handleCloseModal} />
      )}

      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
