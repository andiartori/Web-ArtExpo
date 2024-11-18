import React from "react";
import Points from "@/components/Points";
import { useRouter } from "next/router";
import Head from "next/head";

function PointsPage() {
	const router = useRouter();
	function toHome() {
		router.push({ pathname: "/" });
	}
	return (
		<div>
			<Head>
				<title>
					Art Expo
				</title>
			</Head>
			<div className="w-screen h-screen flex flex-col">
				{/* Main Content */}
				<div className="flex-grow  ">
					<Points />
					<div className="flex justify-center">
						<button
							onClick={() => toHome()}
							className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
						>
							Back to home
						</button>
					</div>
				</div>

				{/* Footer */}
				<div className="bg-black p-5 text-center text-sm font-light text-gray-400">
					<p>&copy; 2024 ART EXPO. All Rights Reserved.</p>
					<p>Made with love for art enthusiasts around the world.</p>
				</div>
			</div>
		</div>
	);
}

export default PointsPage;
