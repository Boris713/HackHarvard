// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Assuming Home is in the correct path
import Environmental from "./pages/environmental";
import Header from "./components/header"; // Import Header
import Sidebar from "./components/sidebar"; // Import Sidebar
import 'bootstrap/dist/css/bootstrap.min.css';
import Portfolio from "./pages/portfolio";

function App() {
  return (
    <Router>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px", // Width of the sidebar
          paddingTop: "60px", // Height of the header
          paddingLeft: "20px", // Optional padding for content
          borderLeft: "1px solid #ccc", // Adds a thin gray border to the left

        }}
      >
        <div className="container">
          <Routes>
            {/* Define all your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/environmental" element={<Environmental />} />
            <Route path="/portfolio" element={<Portfolio/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
