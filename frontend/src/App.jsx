import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { getUserRole } from './services/api';

// import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Home from "./pages/Home";  // Ensure Home is imported
import About from "./pages/About";
// import Footer from "./components/Footer";
import GetStartedPage from "./pages/GetStartedPage"; 
import Sidebar from "./components/Sidebar";
import LibraryManagement from "./pages/dashboard";
import BorrowBooksForm from "./pages/BorrowBooksForm";
import ReturnBooksForm from "./pages/ReturnBooksForm";
// import Transactions from "./pages/transactions";
import UpdateBorrowedBookForm from"./pages/BorrowUpdate";
import Signup from "./pages/Signup";  // Updated import statement
import Home1 from "./pages/Home1"; // Importing Home1
import MoodBasedBookRecommendation from "./pages/MoodBasedBookRecommendation"; // Updated import statement
import UserAccount from "./pages/UserAccount";  // Match the casing of the actual file
import UserAdmin from "./pages/UserAdmin";

// Create a ProtectedRoute component for admin-only access
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = getUserRole();

  if (!token || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

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
      {/* {!hideNavbarAndFooter && <Navbar />} */}
      <Routes>
      <Route path="/" element={<Home1  />} />

        <Route path="/home" element={<Home />} /> {/* Home page added correctly here */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<LibraryManagement />} />
        <Route path="/borrow" element={<BorrowBooksForm />} />
        <Route path="/returns" element={<ReturnBooksForm />} />
        {/* <Route path="/transactions" element={<Transactions />} /> */}
        <Route path="/Borrowerupdate"element={<UpdateBorrowedBookForm/>}/>
        
        <Route path="/signup" element={<Signup />} /> {/* Updated route */}
        <Route path="/MoodBasedBookRecommendation" element={<MoodBasedBookRecommendation />} /> {/* Updated route */}
        
        <Route path="/UserAccount" element={<UserAccount />} /> {/* Updated route */}
        <Route path="/UserAdmin" element={<AdminRoute><UserAdmin /></AdminRoute>} /> 
        
        

      </Routes>
      {/* {!hideNavbarAndFooter && <Footer />} */}
    </>
  );
}

export default App;
