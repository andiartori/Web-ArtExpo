// components/EventTypePieChart.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
	Chart,
	PieController,
	ArcElement,
	Tooltip,
	Legend,
	ChartData,
	ChartConfiguration,
} from "chart.js";
import Cookies from "js-cookie";

Chart.register(PieController, ArcElement, Tooltip, Legend);

interface EventTypeData {
	event_type: string;
	_count: { event_type: number };
}

const EventTypePieChart: React.FC = () => {
	const [eventTypeData, setEventTypeData] = useState<EventTypeData[]>([]);
	const [loading, setLoading] = useState(true);
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstanceRef = useRef<Chart<"pie"> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const accessToken = Cookies.get("access_token");
		const fetchEventTypeCounts = async () => {
			try {
				const response = await axios.get(
					"/api/admin/statistics/eventTypeCount",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setEventTypeData(response.data.data);
				setError(null); // Reset any previous error on successful fetch
			} catch (error) {
				const err = error as Error;
				setError(
					"Failed to fetch event type counts. Please try again later." + err
				); // Set a user-friendly error message
			} finally {
				setLoading(false);
			}
		};
		fetchEventTypeCounts();
	}, []);

	useEffect(() => {
		// Cleanup when component unmounts
		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, []);

	useEffect(() => {
		if (loading || !chartRef.current) return;

		const labels = eventTypeData.map((item) => item.event_type);
		const data = eventTypeData.map((item) => item._count.event_type);
		const totalEvents = data.reduce((acc, value) => acc + value, 0);

		// Define ChartData with explicit type
		const chartData: ChartData<"pie", number[], string> = {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#66BB6A",
						"#FFA726",
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#66BB6A",
						"#FFA726",
					],
				},
			],
		};

		// Define configuration with explicit type
		const config: ChartConfiguration<"pie", number[], string> = {
			type: "pie",
			data: chartData,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: "top",
					},
					tooltip: {
						enabled: true,
						callbacks: {
							label: function (context) {
								const dataIndex = context.dataIndex;
								const count = data[dataIndex];
								const percentage = ((count / totalEvents) * 100).toFixed(2);
								return `${context.label}: ${count} (${percentage}%)`;
							},
						},
					},
				},
			},
		};

		// Destroy existing chart instance to avoid duplicates
		if (chartInstanceRef.current) {
			chartInstanceRef.current.destroy();
		}

		// Create new chart instance
		chartInstanceRef.current = new Chart(chartRef.current, config);
	}, [eventTypeData, loading]);

	if (loading) return <p>Loading chart...</p>;

	if (error) {
		// Display the error message if fetching fails
		return <p className="text-red-500">{error}</p>;
	}

	return (
		<div className="w-1/2 max-w-md mx-auto">
			<canvas ref={chartRef}></canvas>
		</div>
	);
};

export default EventTypePieChart;
