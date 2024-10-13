// // src/components/SustainabilityChart.jsx
// import React, { useState, useEffect } from 'react';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import data from '../assets/data.json'; // Correct import path

// // Register Chart.js components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );
// const meanScores = import.meta.env.VITE_MEAN_SCORES.split(',').map(Number);
// const medianScores = import.meta.env.VITE_MEDIAN_SCORES.split(',').map(Number);

// console.log(meanScores); // [21.41, 21.36, 21.52, 21.58, 21.03, 21.54]
// console.log(medianScores); // [23.40, 23.65, 24.00, 24.00, 23.50, 23.08]

// const SustainabilityChart = ({selectedCompany}) => {
//     const [chartData, setChartData] = useState({});
//     const [error, setError] = useState(null);

//     // Update chart data when selectedCompany changes
//     useEffect(() => {
//         if (!selectedCompany) return;

//         const company = data.find(c => c.name === selectedCompany);
//         if (!company) {
//             setError(`Company "${selectedCompany}" not found.`);
//             return;
//         }

//         // Define labels from 2020 to 2025
//         const labels = [2020, 2021, 2022, 2023, 2024, 2025];

//         // Extract scoresData and append predicted_score_2025
//         const scores = [...company.scoresData].reverse(); // Reverse to match labels (2020-2024)
//         scores.push(company.predicted_score_2025); // Add 2025 prediction

//         // Prepare data for Chart.js
//         const chartData = {
//             labels: labels,
//             datasets: [
//                 {
//                     label: `${selectedCompany} Environmental Risk Score`,
//                     data: scores,
//                     fill: true,
//                     backgroundColor: 'rgba(195, 40, 96, 0.2)', // Reduced opacity
//                     borderColor: 'rgba(195, 40, 96, 1)',
//                     pointBackgroundColor: 'rgba(195, 40, 96, 1)',
//                     pointBorderColor: '#202b33',
//                     pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
//                     pointHoverBorderColor: '#fff',
//                     tension: 0.3,
//                 },
//                 {
//                     label: 'Average Risk of S&P 500',
//                     data: meanScores,
//                     fill: false,
//                     backgroundColor: 'rgba(255, 172, 100, 0.1)',
//                     borderColor: 'rgba(255, 172, 100, 0.3)',
//                     pointBackgroundColor: 'rgba(255, 172, 100, 1)',
//                     pointBorderColor: '#202b33',
//                     pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
//                     pointHoverBorderColor: '#fff',
//                     tension: 0.3,
//                 },
//                 {
//                     label: 'Median Risk of S&P 500',
//                     data: medianScores,
//                     fill:false,
//                     backgroundColor: 'rgba(19, 71, 34, 0.3)',
//                     borderColor: 'rgba(88, 188, 116, 0.3)',
//                     pointBackgroundColor: 'rgba(88, 188, 116, 1)',
//                     pointBorderColor: '#202b33',
//                     pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
//                     pointHoverBorderColor: '#fff',
//                     tension: 0.3,
//                 }
//             ],
//         };

//         setChartData(chartData);
//     }, [selectedCompany]);

//     if (error) return <p style={{ color: 'red' }}>{error}</p>;

//     return (
//         <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>

//             {chartData.labels ? (
//                 <Line
//                     data={chartData}
//                     options={{
//                         responsive: true,
//                         y:{
//                             min: 0,
//                             max: 35
//                         },
//                         plugins: {
//                             legend: {
//                                 position: 'top',
//                             },
//                             title: {
//                                 display: true,
//                                 text: `${selectedCompany} Environmental Risk Score (2020-2025)`,
//                             },
//                             tooltip: {
//                                 callbacks: {
//                                     label: function(context) {
//                                         const year = context.label;
//                                         const score = context.parsed.y;
//                                         if (year === 2025) {
//                                             return `${context.dataset.label} (Predicted): ${score}`;
//                                         }
//                                         return `${context.dataset.label}: ${score}`;
//                                     }
//                                 }
//                             }
//                         },
//                         scales: {
//                             y: {
//                                 beginAtZero: true,
//                                 title: {
//                                     display: true,
//                                     text: 'Sustainability Score',
//                                 },
//                             },
//                             x: {
//                                 title: {
//                                     display: true,
//                                     text: 'Year',
//                                 },
//                             },
//                         },
//                     }}
//                 />
//             ) : (
//                 <p>No chart data available.</p>
//             )}
//         </div>
//     );
// };

// export default SustainabilityChart;
