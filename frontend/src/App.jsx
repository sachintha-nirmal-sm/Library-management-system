import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Home1 from "./pages/Home1";
import Login from "./pages/Login";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import { useState } from "react";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import About from "./pages/About";
import Footer from "./components/Footer";
import EmyLibrary from "./pages/EmyLibrary";
import BookForm from "./components/BookForm";
import UpdateBook from "./components/UpdateBook";
import CategoryPage from "./pages/CategoryPage";
import LearnMore from "./pages/h-Learnmore";
import WatchLater from "./pages/WatchLater";
import BookDetails from "./pages/BookDetails";

import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
//import { AdvancedImage } from '@cloudinary/react';

function App() {
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

  const cld = new Cloudinary({ cloud: { cloudName: 'dq0zuo86p' } });

  // Use this sample image or upload your own via the Media Explorer
  const img = cld
    .image('cld-sample-5')
    .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/home2" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/a-booklist" element={<BookList onBookClick={handleBookClick} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/mylibrary" element={<EmyLibrary />} />
          {/* <Route path="/bookmodel" element={<BookModal />} /> */}
          <Route path="/a-bookform" element={<BookForm />} />
          <Route path="/a-updatebook/:isbn" element={<UpdateBook />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/h-Learnmore" element={<LearnMore />} />
          <Route path="/watchlater" element={<WatchLater />} />
          <Route path="/book/:isbn" element={<BookDetails />} />
        </Routes>
        {isModalOpen && selectedBook && (
          <BookModal book={selectedBook} onClose={handleCloseModal} />
        )}
        {/* /<AdvancedImage cldImg={img} /> */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
