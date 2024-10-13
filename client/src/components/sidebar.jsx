// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import './sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button for small screens */}
      <Button
        variant="primary"
        onClick={toggleSidebar}
        className="d-md-none fixed-top"
        style={{ top: "60px", left: isOpen ? "250px" : "0", zIndex: "1100" }}
      >
        ☰
      </Button>

      {/* Sidebar */}
      <div
        className={`d-flex flex-column text-white sidebar-border ${
          isOpen ? "d-block" : "d-none"
        } d-md-flex`}
        style={{
          width: "250px",
          position: "fixed",
          top: "0px", // Height of the header
          left: "0",
          height: "calc(100% - 60px)", // Full height minus header
          transition: "all 0.3s",
          border: "1px",
        }}
      >
        
        <div className="buttoncontainer">
          {/* Refactored Buttons */}
          <h1 className="title">Envest</h1>

          <Button
            as={Link}
            to="/environmental"
            className="butt mb-2"
            variant="light"
          >
            Explore
          </Button>
          <Button
            as={Link}
            to="/portfolio"
            className="butt mb-2"
            variant="light"
          >
            Portfolio
          </Button>
        </div>
      </div>
    </>
  );
}
