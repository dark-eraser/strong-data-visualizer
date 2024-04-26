import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import "@/styles/ChartComponent.css";

const CSVChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function fetchCSV() {
      const response = await fetch('/data/strong.csv');
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const uniqueWorkouts = Array.from(new Set(results.data.map(d => d['Workout Name']))).sort();
          setWorkouts(uniqueWorkouts);
          if (uniqueWorkouts.length > 0) {
            setSelectedWorkout(uniqueWorkouts[0]);
          }
        }
      });
    }
    fetchCSV();
  }, []);

  useEffect(() => {
    async function fetchCSV() {
      const response = await fetch('/data/strong.csv');
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const filteredData = results.data.filter(d => d['Workout Name'] === selectedWorkout);
          const groupedData = filteredData.reduce((acc, curr) => {
            const date = curr.Date.split(' ')[0]; // Splitting to get only the date part, ignoring time
            if (!acc[date]) {
              acc[date] = { totalWeightReps: 0, count: 0 };
            }
            // Calculate weight-reps product for this set and add to the total
            const weightReps = (parseFloat(curr.Weight) || 0) * (parseInt(curr.Reps) || 0);
            acc[date].totalWeightReps += weightReps;
            acc[date].count += 1; // Increment the count for averaging
            return acc;
          }, {});

          const dates = Object.keys(groupedData).sort(); // Sorting dates
          const weightRepsTotals = dates.map(date => groupedData[date].totalWeightReps); // Array of total weight-reps per date
          const averageWeightReps = dates.map(date => (groupedData[date].totalWeightReps / groupedData[date].count) || 0); // Array of average weight-reps per date

          setChartData({
            labels: dates,
            datasets: [
              {
                label: `Total Weight-Reps per Day for ${selectedWorkout}`,
                data: weightRepsTotals,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
              // If you also want to plot the average weight-reps per day, uncomment the following dataset
              // {
              //   label: `Average Weight-Reps per Day for ${selectedWorkout}`,
              //   data: averageWeightReps,
              //   borderColor: 'rgb(255, 99, 132)',
              //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
              // },
            ],
          });
        }
      });
    }

    if (selectedWorkout) {
      fetchCSV();
    }
  }, [selectedWorkout]);

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="workout-select-label">Workout</InputLabel>
        <Select
          labelId="workout-select-label"
          id="workout-select"
          value={selectedWorkout}
          label="Workout"
          onChange={(e) => setSelectedWorkout(e.target.value)}
        >
          {workouts.map((workout) => (
            <MenuItem key={workout} value={workout}>
              {workout}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default CSVChart;