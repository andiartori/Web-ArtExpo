// components/UserCountDisplay.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserCount: React.FC = () => {
	const [userCount, setUserCount] = useState<number | null>(null);
	const [displayCount, setDisplayCount] = useState(0); // State for animated count display
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserCount = async () => {
			const accessToken = Cookies.get("access_token");
			try {
				const response = await axios.get(
					"/api/admin/statistics/totalUserCount",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setUserCount(response.data.data.userCount);
			} catch (error) {
				setError(`Error fetching user count: , ${error}`);
			}
		};

		fetchUserCount();
	}, []);

	useEffect(() => {
		if (userCount === null) return;

		// Reset displayCount and animate to userCount
		setDisplayCount(0);
		const increment = Math.ceil(userCount / 100); // Speed control: increment based on count
		const interval = setInterval(() => {
			setDisplayCount((prevCount) => {
				if (prevCount >= userCount) {
					clearInterval(interval);
					return userCount;
				}
				return prevCount + increment;
			});
		}, 60); // Adjust the speed of animation

		return () => clearInterval(interval);
	}, [userCount]);

	if (userCount === null) {
		return <p>Loading user count...</p>;
	}

	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-center">
			<h2 className="text-lg font-semibold">Total Registered Users</h2>
			<p className="text-2xl font-bold">{displayCount}</p>
		</div>
	);
};

export default UserCount;
