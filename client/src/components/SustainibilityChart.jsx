// src/components/SustainabilityChart.jsx
import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import data from '../assets/data.json'; // Ensure correct import path

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin // Register the annotation plugin
);

// Retrieve mean and median scores from environment variables
const meanScores = import.meta.env.VITE_MEAN_SCORES
    ? import.meta.env.VITE_MEAN_SCORES.split(',').map(Number)
    : [];
const medianScores = import.meta.env.VITE_MEDIAN_SCORES
    ? import.meta.env.VITE_MEDIAN_SCORES.split(',').map(Number)
    : [];

console.log(meanScores); // [21.41, 21.36, 21.52, 21.58, 21.03, 21.54]
console.log(medianScores); // [23.40, 23.65, 24.00, 24.00, 23.50, 23.08]

const SustainabilityChart = ({ selectedCompany }) => {
    const [chartData, setChartData] = useState({});
    const [error, setError] = useState(null);

    // Update chart data when selectedCompany changes
    useEffect(() => {
        if (!selectedCompany) return;

        const company = data.find(c => c.name === selectedCompany);
        if (!company) {
            setError(`Company "${selectedCompany}" not found.`);
            return;
        }

        // Define labels from 2020 to 2025
        const labels = [2020, 2021, 2022, 2023, 2024, 2025];

        // Ensure scoresData is ordered correctly
        const scores = [...company.scoresData]; // [2020, 2021, 2022, 2023, 2024]
        if (company.predicted_score_2025 !== undefined && !isNaN(company.predicted_score_2025)) {
            scores.push(company.predicted_score_2025); // Add 2025 prediction
        } else {
            scores.push(0); // Fallback if predicted_score_2025 is missing
        }

        // Prepare data for Chart.js
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: `${selectedCompany} Environmental Risk Score`,
                    data: scores,
                    fill: true,
                    backgroundColor: 'rgba(195, 40, 96, 0.2)', // Semi-transparent fill
                    borderColor: 'rgba(195, 40, 96, 1)',
                    pointBackgroundColor: (context) => {
                        const index = context.dataIndex;
                        const year = context.chart.data.labels[index];
                        return year === 2025 ? 'rgba(255, 255, 255, 1)' : 'rgba(195, 40, 96, 1)';
                    },
                    pointBorderColor: '#202b33',
                    pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
                    pointHoverBorderColor: '#fff',
                    pointRadius: (context) => {
                        const index = context.dataIndex;
                        const year = context.chart.data.labels[index];
                        return year === 2025 ? 8 : 6; // Larger radius for 2025
                    },
                    pointStyle: (context) => {
                        const index = context.dataIndex;
                        const year = context.chart.data.labels[index];
                        return year === 2025 ? 'triangle' : 'circle'; // Different shape for 2025
                    },
                    tension: 0.3,
                },
                {
                    label: 'Average Risk of S&P 500',
                    data: meanScores,
                    fill: false,
                    borderColor: 'rgba(255, 172, 100, 0.7)',
                    borderDash: [5, 5], // Dashed line for differentiation
                    pointBackgroundColor: 'rgba(255, 172, 100, 1)',
                    pointBorderColor: '#202b33',
                    pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
                    pointHoverBorderColor: '#fff',
                    tension: 0.3,
                },
                {
                    label: 'Median Risk of S&P 500',
                    data: medianScores,
                    fill: false,
                    borderColor: 'rgba(88, 188, 116, 0.7)',
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(88, 188, 116, 1)',
                    pointBorderColor: '#202b33',
                    pointHoverBackgroundColor: 'rgba(225,225,225,0.9)',
                    pointHoverBorderColor: '#fff',
                    tension: 0.3,
                }
            ],
        };

        setChartData(chartData);
    }, [selectedCompany]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '20px', backgroundColor: '#202b33', borderRadius: '8px' }}>
            {chartData.labels ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#fff', // Legend text color
                                },
                            },
                            title: {
                                display: true,
                                text: `${selectedCompany} Environmental Risk Score (2020-2025)`,
                                color: '#fff',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const year = context.label;
                                        const score = context.parsed.y;
                                        if (year === 2025) {
                                            return `${context.dataset.label} (Predicted): ${score}`;
                                        }
                                        return `${context.dataset.label}: ${score}`;
                                    }
                                }
                            },
                            annotation: {
                                annotations: {
                                    predictedLine: {
                                        type: 'line',
                                        yMin: chartData.datasets[0].data[5], // 2025 score
                                        yMax: chartData.datasets[0].data[5],
                                        xMin: 5, // Index of 2025 in labels
                                        xMax: 5,
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        borderWidth: 2,
                                        label: {
                                            enabled: true,
                                            content: '2025 Prediction',
                                            position: 'start',
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: '#fff',
                                            yAdjust: -10,
                                        }
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 0,
                                max: 35,
                                ticks: {
                                    color: '#fff', // y-axis labels color
                                },
                                grid: {
                                    color: 'rgba(225, 255, 255, 0.02)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                title: {
                                    display: true,
                                    text: 'Sustainability Score',
                                    color: '#fff',
                                },
                            },
                            x: {
                                ticks: {
                                    color: '#fff', // x-axis labels color
                                },
                                grid: {
                                    color: 'rgba(225, 255, 255, 0.02)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                title: {
                                    display: true,
                                    text: 'Year',
                                    color: '#fff',
                                },
                            },
                        },
                    }}
                />
            ) : (
                <p style={{ color: '#fff', textAlign: 'center' }}>No chart data available.</p>
            )}
        </div>
    );
};

export default SustainabilityChart;
