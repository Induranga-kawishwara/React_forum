import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserDetails from "./pages/UserDetails";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Navbar />
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Footer />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
