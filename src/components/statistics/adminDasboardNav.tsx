import React from "react";
import {
	FaPlus,
	FaEdit,
	FaTrashAlt,
	FaChartLine,
	FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const AdminDashboard = () => {
	const router = useRouter();

	const handleLogout = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to log out?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, log out",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				Cookies.remove("access_token"); // Remove the token
				router.push("/"); // Redirect to the home page
				Swal.fire("Logged Out", "You have been logged out.", "success");
			}
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-black to-yellow-700 flex items-center justify-center p-10">
			<div className="container mx-auto">
				<div className="flex justify-start my-5 ">
					<img
						src="https://res.cloudinary.com/dxu67syjj/image/upload/v1731462634/Screenshot_2024-11-13_at_08.45.28_uftprx.png"
						alt="logoimage"
						style={{ width: "300px", height: "auto" }}
					/>
				</div>

				<h1 className="text-4xl font-bold text-white text-center mb-10">
					Admin Dashboard
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
					{/* Create Events Card */}
					<div
						className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105 cursor-pointer"
						onClick={() => router.push("/adminhome/createEvent")}
					>
						<div className="text-blue-500 text-6xl mb-4">
							<FaPlus />
						</div>
						<h2 className="text-xl font-bold text-gray-800">Create Events</h2>
						<p className="text-gray-600 mt-2">Add new events to the system</p>
						<button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							Add Event
						</button>
					</div>

					{/* Event List - Edit/Delete Card */}
					<div
						className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105 cursor-pointer"
						onClick={() => router.push("/adminhome/editDelete")}
					>
						<div className="text-yellow-500 text-6xl mb-4 flex justify-center space-x-4">
							<FaEdit /> <FaTrashAlt />
						</div>
						<h2 className="text-xl font-bold text-gray-800">
							Event List - Edit / Delete
						</h2>
						<p className="text-gray-600 mt-2">
							Manage or remove existing events
						</p>
						<button className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
							Manage Events
						</button>
					</div>

					{/* Statistics Card */}
					<div
						className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105 cursor-pointer"
						onClick={() => router.push("/adminhome/statistics")}
					>
						<div className="text-green-500 text-6xl mb-4">
							<FaChartLine />
						</div>
						<h2 className="text-xl font-bold text-gray-800">Statistics</h2>
						<p className="text-gray-600 mt-2">View detailed statistics</p>
						<button className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
							View Statistics
						</button>
					</div>

					{/* Logout Card */}
					<div
						className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105 cursor-pointer"
						onClick={handleLogout}
					>
						<div className="text-red-500 text-6xl mb-4">
							<FaSignOutAlt />
						</div>
						<h2 className="text-xl font-bold text-gray-800">Logout</h2>
						<p className="text-gray-600 mt-2">Sign out of your account</p>
						<button className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
							Log Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
