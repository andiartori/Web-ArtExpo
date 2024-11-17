// components/MonthlyStatisticsChart.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, ChartConfiguration } from "chart.js";
import Cookies from "js-cookie";

import {
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register the components you need
Chart.register(
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Title,
	Tooltip,
	Legend
);

interface MonthlyStatistics {
	month: number;
	total_amount: number;
}

const MonthlyStatisticsChart: React.FC = () => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstance = useRef<Chart | null>(null);
	const [monthlyStatistics, setMonthlyStatistics] = useState<
		MonthlyStatistics[]
	>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMonthlyStatistics = async () => {
			const accessToken = Cookies.get("access_token");
			try {
				const response = await axios.get("/api/admin/statistics/monthly", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setMonthlyStatistics(response.data.data);
				setError(null);
			} catch (error) {
				const err = error as Error;
				setError("Error fetching monthly statistics" + err.message);
			}
		};

		fetchMonthlyStatistics();
	}, []);

	useEffect(() => {
		if (chartRef.current && monthlyStatistics.length > 0) {
			const ctx = chartRef.current.getContext("2d");
			if (ctx) {
				// Destroy existing chart instance if it exists
				if (chartInstance.current) {
					chartInstance.current.destroy();
				}

				const chartConfig: ChartConfiguration = {
					type: "line",
					data: {
						labels: monthlyStatistics.map((stat) => `Month ${stat.month}`),
						datasets: [
							{
								label: "Total Amount",
								data: monthlyStatistics.map((stat) => stat.total_amount),
								borderColor: "rgba(75, 192, 192, 1)",
								backgroundColor: "rgba(75, 192, 192, 0.2)",
								fill: true,
							},
						],
					},
					options: {
						responsive: true,
						scales: {
							x: {
								title: {
									display: true,
									text: "Month",
									color: "#333",
									font: {
										size: 14,
										weight: "bold",
									},
								},
								grid: {
									color: "rgba(0, 0, 0, 0.1)", // Lighter grid line
									lineWidth: 1,
								},
								ticks: {
									color: "#333",
									font: {
										size: 12,
									},
								},
							},
							y: {
								beginAtZero: true,
								title: {
									display: true,
									text: "Total Amount",
									color: "#000",
									font: {
										size: 14,
										weight: "bold",
									},
								},
								grid: {
									color: "rgba(0, 0, 0, 0.1)", // Lighter grid line
									lineWidth: 1,
								},
								ticks: {
									color: "#333",
									font: {
										size: 12,
									},
								},
							},
						},
					},
				};

				// Create new chart instance
				chartInstance.current = new Chart(ctx, chartConfig);
			}
		}

		// Cleanup function to destroy the chart when component unmounts
		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [monthlyStatistics]);

	return (
		<div>
			{/* Render error message if there's an error */}
			{error && <p className="text-red-500">{error}</p>}
			<canvas ref={chartRef}></canvas>
		</div>
	);
};

export default MonthlyStatisticsChart;
