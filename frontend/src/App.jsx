import React from "react";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/Footer";
import GetStartedPage from "./pages/GetStartedPage";
import EmyLibrary from "./pages/EmyLibrary";
import Home1 from "./pages/Home1"; // Importing Home1
import BookModal from "./components/BookModal"; // Importing BookModal component

import BookForm from "./components/BookForm"; // Importing BookForm component





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
        <Route path="/" element={<Home1  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/mylibrary" element={<EmyLibrary />} />
        <Route path="/home" element={<Home/>} /> 

        <Route path="/bookmodel" element={<BookModal/>} />

        <Route path="/bookform" element={<BookForm/>} /> 
        


      </Routes>
    <Footer />
    </>
  );
}

export default App;
