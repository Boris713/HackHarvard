import React, { useState } from "react";
import "../index.css";
import "./header.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate to redirect to search results page

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Set up navigation to redirect

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle the search when user presses Enter
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or page reload

      if (searchTerm.trim() === "") return;

      try {
        // Make the fetch request to your backend
        const response = await fetch("http://localhost:5000/api/semanticSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: searchTerm }),
        });

        if (!response.ok) {
          throw new Error("Error fetching search results");
        }

        const data = await response.json();
        const companies = data.results; // Get the search results from the API

        // Redirect to the search results page and pass the data as state
        navigate("/search-results", { state: { companies } });
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

  return (
    <header
      className="text-white fixed-top w-100"
      style={{ zIndex: "1000", height: "60px" }}
    >
      <div className="container h-100">
        <div className="row align-items-center h-100">
          {/* EcoTrackr title in the center */}
          <div className="col d-flex justify-content-end">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
