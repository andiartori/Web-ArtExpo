import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "@/utils/hooks/useAuth";
import Cookies from "js-cookie";
import MonthlyStatisticsChart from "@/components/statistics/monthlyStatistics";
import EventTypePieChart from "@/components/statistics/EventTypePieChart";
import UserCount from "@/components/statistics/UserCount";
import TotalPaidAmountDisplay from "@/components/statistics/TotalPaidAmountDisplay";
import {
	FaChartLine,
	FaUsers,
	FaMoneyBillAlt,
	FaChartPie,
	FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/router";

const StatisticsPage: React.FC = () => {
	useAuth();
	const router = useRouter();

	const handleBackClick = () => {
		router.push("/adminhome");
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center bg-gray-100">
			<div className="container mx-auto p-6">
				<h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
					Monthly Statistics Overview
				</h1>

				<button
					className="bg-yellow-500 text-black py-2 px-4 my-4 rounded hover:text-white hover:bg-yellow-600 flex"
					onClick={handleBackClick}
				>
					<FaArrowLeft className="mr-2" /> BACK TO ADMIN HOMEPAGE
				</button>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
					{/* Monthly Statistics */}
					<div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105">
						<div className="flex items-center space-x-4">
							<FaChartLine className="text-white text-4xl" />
							<h2 className="text-xl font-semibold text-white">
								Monthly Statistics
							</h2>
						</div>
						<div className="mt-4">
							<MonthlyStatisticsChart />
						</div>
					</div>

					{/* Event Type Distribution */}
					<div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105">
						<div className="flex items-center space-x-4">
							<FaChartPie className="text-white text-4xl" />
							<h2 className="text-xl font-semibold text-white">
								Event Type Distribution
							</h2>
						</div>
						<div className="mt-4">
							<EventTypePieChart />
						</div>
					</div>

					{/* User Count */}
					<div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105">
						<div className="flex items-center space-x-4">
							<FaUsers className="text-white text-4xl" />
							<h2 className="text-xl font-semibold text-white">
								Total Registered Users
							</h2>
						</div>
						<div className="mt-4">
							<UserCount />
						</div>
					</div>

					{/* Total Paid Amount */}
					<div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105">
						<div className="flex items-center space-x-4">
							<FaMoneyBillAlt className="text-white text-4xl" />
							<h2 className="text-xl font-semibold text-white">
								Total Paid Amount
							</h2>
						</div>
						<div className="mt-4">
							<TotalPaidAmountDisplay />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatisticsPage;
