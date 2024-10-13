import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // Assuming Home is in the correct path
import Environmental from "./pages/environmental";
import Social from "./pages/Social";
import Governance from "./pages/Governance";
import Portfolio from "./pages/portfolio";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define all your routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/environmental" element={<Environmental />} />
        <Route path="/social" element={<Social />} />
        <Route path="/governance" element={<Governance />} />
        <Route path = '/portfolio' element={<Portfolio/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
