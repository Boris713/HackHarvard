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
  if (percentage >= 40) {
    return '#f44336'; // RED
  } else if (percentage >= 20) {
    return '#ffeb3b'; // Yellow
  } else {
    return '#4caf50'; // Green
  }
};

const ScoreRing = ({ percentage, text }) => {
  const color = getColor((percentage/30)*100);

  return (
    <div className="score-ring">
      <CircularProgressbar
        value={(percentage/30)* 100}
        text={`${percentage}`}
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
