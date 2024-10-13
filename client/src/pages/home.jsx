// src/pages/Home.js
import React from "react";
import Header from "../components/header"; // Ensure correct casing
import Sidebar from "../components/sidebar"; // Ensure correct casing

function Home() {
  return (
    <>
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
        }}
      >
        <div className="container">
          <h2>Welcome to EcoTrackr</h2>
          <p>Use the navigation links on the left to explore different sections.</p>
          {/* Add uploading image here also */}
        </div>
      </div>
    </>
  );
}

export default Home;
