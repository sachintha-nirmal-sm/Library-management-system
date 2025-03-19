import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/Footer";
import GetStartedPage from "./pages/GetStartedPage"; 

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;
