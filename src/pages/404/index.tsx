import React from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

function NotFound() {
	const router = useRouter();
	const handleBackClick = () => {
		router.push("/");
	};
	return (
		<div className="w-screen h-screen items-center align-middle">
			<div className="flex">
				<img src="/404.jpg" alt="no image" />
			</div>
			<div className="flex justify-center">
				<button
					className="bg-yellow-500 text-black py-2 px-4 my-4 rounded hover:text-white hover:bg-yellow-600 flex"
					onClick={handleBackClick}
				>
					<FaArrowLeft className="mr-2" /> BACK TO HOME
				</button>
			</div>
		</div>
	);
}

export default NotFound;
