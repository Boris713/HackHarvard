import { useState } from "react";
import Sidebar from "./sidebar"; // Import Sidebar component
import "../index.css";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Bootstrap Header */}
      <header className="bg-primary text-white fixed-top" style={{ marginLeft: '250px', zIndex: '10', width: 'calc(100% - 250px)' }}>
        <div className="container">
          <div className="row align-items-center py-3">
            
            {/* EcoTrackr title in the center */}
            <div className="col text-center">
              <h1 className="h3">EcoTrackr</h1>
            </div>

            {/* Search bar in the center */}
            <div className="col d-flex justify-content-end">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                style={{ maxWidth: '250px' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content shifted to the right to avoid overlapping with the sidebar */}
      <div style={{ marginLeft: '250px', paddingTop: '80px' }}>
        {/* Your main content goes here */}
        <div className="container">
          <h2>Welcome to EcoTrackr</h2>
          <p>Use the navigation links on the left to explore different sections.</p>
        </div>
      </div>
    </>
  );
}
