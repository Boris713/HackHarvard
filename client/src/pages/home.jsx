import React from "react";
import { useState } from "react";
import Header from "../components/header";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
        <Header />
        {/* header here */}
        <div>
            <p>Welcome to EcoTrackr!!</p>
        </div>
        {/* body here */}
        {/* add uploading image here also */}
    </div>
  );
}

export default Home;
// search bar for companies hide elsewhere 
// top total 