import React, { useState } from "react";

const NavSelection = ({ children }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset when mouse leaves
      className={`px-4 py-2 font-semibold text-white rounded-lg transition-colors ${
        isPressed ? "bg-blue-700" : "bg-blue-500"
      } hover:bg-blue-600`}
    >
      {children}
    </button>
  );
};

export default NavSelection;
