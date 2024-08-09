import React from 'react';
import './lineChart.css'
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = () => {
    const data = {
        labels: [
            'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 
            'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 
            'Day 11', 'Day 12', 'Day 13', 'Day 14', 'Day 15'
        ],
        datasets: [
            {
                data: [5, 10, 15, 20, 25, 30, 22, 40, 45, 50, 55, 60, 50, 70, 75],
                fill: false,
                backgroundColor: '#F62943',
                borderColor: '#F62943',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true, 
                    color: 'rgba(200, 200, 200, 0.3)',
                    lineWidth: 1, 
                    borderDash: [5, 5], 
                },
            },
            x: {
                grid: {
                    display: false, 
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className='chart-line'>
            <Line data={data} options={options} style={{ width: '100%', height: '100%' }}/>
        </div>
    )
        
};

export default LineChart;
