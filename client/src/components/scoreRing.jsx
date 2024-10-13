// src/components/ScoreRing.jsx
import React from 'react';
import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './scoreRing.css'; // Optional: For additional styling

// Helper function to determine the color based on percentage
const getColor = (percentage) => {
  if (percentage >= 70) {
    return '#4caf50'; // Green
  } else if (percentage >= 50) {
    return '#ffeb3b'; // Yellow
  } else {
    return '#f44336'; // Red
  }
};

const ScoreRing = ({ percentage, text }) => {
  const color = getColor(percentage);

  return (
    <div className="score-ring">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: color,
          trailColor: '#d6d6d6',
          textColor: '#333',
          strokeWidth: 8,
          strokeLinecap: 'round',
          // Transition animation
          pathTransitionDuration: 1.5,
        })}
      />
      {text && <div className="score-text">{text}</div>}
    </div>
  );
};

export default ScoreRing;
