// components/TotalPaidAmountDisplay.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const TotalPaidAmountDisplay: React.FC = () => {
	const [totalPaidAmount, setTotalPaidAmount] = useState<number | null>(null);
	const [displayedAmount, setDisplayedAmount] = useState(0); // For the animated display
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const accessToken = Cookies.get("access_token");
		const fetchTotalPaidAmount = async () => {
			try {
				const response = await axios.get(
					"/api/admin/statistics/totalPaidAmount",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setTotalPaidAmount(response.data.data.totalPaidAmount);
				setError(null); // Reset any previous error on successful fetch
			} catch (error) {
				setError(`Error fetching total paid amount: ${error}`);
			}
		};

		fetchTotalPaidAmount();
	}, []);

	// Counting up animation effect
	useEffect(() => {
		if (totalPaidAmount !== null) {
			let start = 0;
			const duration = 2000; // Animation duration in ms
			const increment = totalPaidAmount / (duration / 10); // Increment per frame

			const animate = () => {
				start += increment;
				if (start >= totalPaidAmount) {
					setDisplayedAmount(totalPaidAmount);
				} else {
					setDisplayedAmount(Math.floor(start));
					requestAnimationFrame(animate);
				}
			};
			animate();
		}
	}, [totalPaidAmount]);

	if (totalPaidAmount === null) {
		return <p>Loading total paid amount...</p>;
	}

	if (error) {
		// Display the error message if fetching fails
		return <p className="text-red-500">{error}</p>;
	}

	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-center">
			<h2 className="text-lg font-semibold">Total Paid Amount</h2>
			<p className="text-2xl font-bold">
				Rp. {displayedAmount.toLocaleString()}
			</p>
		</div>
	);
};

export default TotalPaidAmountDisplay;
