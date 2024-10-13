import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavSelection from "./NavSelection"; // Your custom button component
import { Button } from "react-bootstrap";

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
        className={`d-flex flex-column bg-primary text-white ${
          isOpen ? "d-block" : "d-none"
        } d-md-flex`}
        style={{
          width: "250px",
          position: "fixed",
          top: "60px", // Height of the header
          left: "0",
          height: "calc(100% - 60px)", // Full height minus header
          transition: "all 0.3s",
        }}
      >
        <NavSelection>
          <Link to="/environmental" className="nav-link text-white text-center py-3">
            Env
          </Link>
        </NavSelection>
        <NavSelection>
          <Link to="/social" className="nav-link text-white text-center py-3">
            Soc
          </Link>
        </NavSelection>
        <NavSelection>
          <Link to="/governance" className="nav-link text-white text-center py-3">
            Gov
          </Link>
        </NavSelection>
      </div>
    </>
  );
}
