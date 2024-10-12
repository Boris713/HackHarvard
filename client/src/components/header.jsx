import { Link } from "react-router-dom";
import NavSelection from "./navSelection"; // Assuming NavSelection is your custom button component
import { useState } from "react";
import "../index.css";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="bg-primary text-primary-foreground w-full fixed top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Empty div to push EcoTrackr to the middle */}
          <div className="flex-1"></div>

          {/* EcoTrackr title in the middle */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">EcoTrackr</h1>
          </div>

          {/* Search bar and navigation links on the right */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 p-2 rounded-md"
            />

            {/* Navigation links (Env, Soc, Gov) */}
            <NavSelection>
              <Link to="/environmental">Env</Link>
            </NavSelection>
            <NavSelection>
              <Link to="/social">Soc</Link>
            </NavSelection>
            <NavSelection>
              <Link to="/governance">Gov</Link>
            </NavSelection>
          </div>
        </div>
      </div>
    </header>
  );
}
