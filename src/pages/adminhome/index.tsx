import React from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import AdminDashboard from "@/components/statistics/adminDasboardNav";
import Head from "next/head";

const Dashboard: React.FC = () => {
	useAuth();

	return (
		<div>
			<Head>
				<title>Art Expo</title>
			</Head>
			<AdminDashboard />
		</div>
	);
};

export default Dashboard;
