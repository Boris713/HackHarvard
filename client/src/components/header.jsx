import React, { useState } from "react";
import "../index.css"; // Ensure your custom styles are imported
import "./header.css"
export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header
      className="text-white fixed-top w-100"
      style={{ zIndex: "1000", height: "60px" }}
    >
      <div className="container h-100">
        <div className="row align-items-center h-100">
          {/* EcoTrackr title in the center */}
  

          {/* Search bar on the right */}
          <div className="col d-flex justify-content-end">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
