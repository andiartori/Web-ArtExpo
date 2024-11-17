import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
	user: number; // Adjust based on your actual data type
	role: string;
}

export const useAuth = () => {
	const router = useRouter();

	useEffect(() => {
		const accessToken = Cookies.get("access_token");

		// If no access token is found, prompt the user to log in and redirect
		if (!accessToken) {
			Swal.fire({
				icon: "warning",
				title: "Please log in first",
				text: "You need to log in to access this page.",
			}).then(() => {
				router.push("/auth/loginuser"); // Redirect to the login page
			});
			return;
		}

		try {
			const decodedToken = jwtDecode<DecodedToken>(accessToken);
			const userRole = decodedToken.role;

			// Check if the user is trying to access the admin page
			if (router.pathname.startsWith("/adminhome") && userRole !== "admin") {
				Swal.fire({
					icon: "error",
					title: "Access Denied",
					text: "You do not have permission to access this page.",
				}).then(() => {
					router.push("/homeuser"); // Redirect to the home user page
				});
			}
		} catch (error) {
			console.error("Token verification failed:", error);
			Swal.fire({
				icon: "error",
				title: "Invalid token",
				text: "Your session has expired. Please log in again.",
			}).then(() => {
				router.push("/auth/loginuser"); // Redirect to the login page
			});
		}
	}, [router]);
};

