import React from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import AdminDashboard from "@/components/statistics/adminDasboardNav";

const Dashboard: React.FC = () => {
	useAuth();

	return (
		<div>
			<AdminDashboard />
		</div>
	);
};

export default Dashboard;
